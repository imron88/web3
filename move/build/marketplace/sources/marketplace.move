module marketplace::marketplace {
    use std::signer;
    use std::string::{String, utf8};
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::timestamp;
    use aptos_framework::event::{Self, EventHandle};
    use aptos_framework::account;
    use aptos_std::table::{Self, Table};

    /// Error codes
    const EPRODUCT_NOT_FOUND: u64 = 1;
    const EPRODUCT_ALREADY_SOLD: u64 = 2;
    const EINSUFFICIENT_PAYMENT: u64 = 3;
    const ENOT_SELLER: u64 = 4;
    const EPRODUCT_NOT_ACTIVE: u64 = 5;
    const EMARKETPLACE_NOT_INITIALIZED: u64 = 6;

    /// Product status
    const STATUS_ACTIVE: u8 = 0;
    const STATUS_SOLD: u8 = 1;
    const STATUS_CANCELLED: u8 = 2;

    /// Product structure
    struct Product has store, drop, copy {
        id: u64,
        seller: address,
        name: String,
        description: String,
        price: u64,
        image_url: String,
        status: u8,
        created_at: u64,
    }

    /// Marketplace resource that stores all products
    struct Marketplace has key {
        products: Table<u64, Product>,
        next_product_id: u64,
        product_listed_events: EventHandle<ProductListedEvent>,
        product_purchased_events: EventHandle<ProductPurchasedEvent>,
        product_cancelled_events: EventHandle<ProductCancelledEvent>,
    }

    /// Event emitted when a product is listed
    struct ProductListedEvent has drop, store {
        product_id: u64,
        seller: address,
        name: String,
        price: u64,
        timestamp: u64,
    }

    /// Event emitted when a product is purchased
    struct ProductPurchasedEvent has drop, store {
        product_id: u64,
        seller: address,
        buyer: address,
        price: u64,
        timestamp: u64,
    }

    /// Event emitted when a product is cancelled
    struct ProductCancelledEvent has drop, store {
        product_id: u64,
        seller: address,
        timestamp: u64,
    }

    /// Initialize the marketplace (only once by deployer)
    public entry fun initialize(account: &signer) {
        let account_addr = signer::address_of(account);

        if (!exists<Marketplace>(account_addr)) {
            move_to(account, Marketplace {
                products: table::new(),
                next_product_id: 1,
                product_listed_events: account::new_event_handle<ProductListedEvent>(account),
                product_purchased_events: account::new_event_handle<ProductPurchasedEvent>(account),
                product_cancelled_events: account::new_event_handle<ProductCancelledEvent>(account),
            });
        }
    }

    /// List a new product for sale
    public entry fun list_product(
        seller: &signer,
        marketplace_addr: address,
        name: String,
        description: String,
        price: u64,
        image_url: String,
    ) acquires Marketplace {
        assert!(exists<Marketplace>(marketplace_addr), EMARKETPLACE_NOT_INITIALIZED);

        let marketplace = borrow_global_mut<Marketplace>(marketplace_addr);
        let product_id = marketplace.next_product_id;
        let seller_addr = signer::address_of(seller);

        let product = Product {
            id: product_id,
            seller: seller_addr,
            name,
            description,
            price,
            image_url,
            status: STATUS_ACTIVE,
            created_at: timestamp::now_seconds(),
        };

        table::add(&mut marketplace.products, product_id, product);
        marketplace.next_product_id = product_id + 1;

        // Emit event
        event::emit_event(&mut marketplace.product_listed_events, ProductListedEvent {
            product_id,
            seller: seller_addr,
            name: product.name,
            price,
            timestamp: timestamp::now_seconds(),
        });
    }

    /// Purchase a product
    public entry fun purchase_product(
        buyer: &signer,
        marketplace_addr: address,
        product_id: u64,
    ) acquires Marketplace {
        assert!(exists<Marketplace>(marketplace_addr), EMARKETPLACE_NOT_INITIALIZED);

        let marketplace = borrow_global_mut<Marketplace>(marketplace_addr);
        assert!(table::contains(&marketplace.products, product_id), EPRODUCT_NOT_FOUND);

        let product = table::borrow_mut(&mut marketplace.products, product_id);
        assert!(product.status == STATUS_ACTIVE, EPRODUCT_ALREADY_SOLD);

        let buyer_addr = signer::address_of(buyer);
        let seller_addr = product.seller;
        let price = product.price;

        // Transfer coins from buyer to seller
        coin::transfer<AptosCoin>(buyer, seller_addr, price);

        // Update product status
        product.status = STATUS_SOLD;

        // Emit event
        event::emit_event(&mut marketplace.product_purchased_events, ProductPurchasedEvent {
            product_id,
            seller: seller_addr,
            buyer: buyer_addr,
            price,
            timestamp: timestamp::now_seconds(),
        });
    }

    /// Cancel a product listing (only seller can cancel)
    public entry fun cancel_product(
        seller: &signer,
        marketplace_addr: address,
        product_id: u64,
    ) acquires Marketplace {
        assert!(exists<Marketplace>(marketplace_addr), EMARKETPLACE_NOT_INITIALIZED);

        let marketplace = borrow_global_mut<Marketplace>(marketplace_addr);
        assert!(table::contains(&marketplace.products, product_id), EPRODUCT_NOT_FOUND);

        let product = table::borrow_mut(&mut marketplace.products, product_id);
        let seller_addr = signer::address_of(seller);

        assert!(product.seller == seller_addr, ENOT_SELLER);
        assert!(product.status == STATUS_ACTIVE, EPRODUCT_NOT_ACTIVE);

        // Update status to cancelled
        product.status = STATUS_CANCELLED;

        // Emit event
        event::emit_event(&mut marketplace.product_cancelled_events, ProductCancelledEvent {
            product_id,
            seller: seller_addr,
            timestamp: timestamp::now_seconds(),
        });
    }

    /// View function to get product details
    #[view]
    public fun get_product(marketplace_addr: address, product_id: u64): (u64, address, String, String, u64, String, u8, u64) acquires Marketplace {
        assert!(exists<Marketplace>(marketplace_addr), EMARKETPLACE_NOT_INITIALIZED);

        let marketplace = borrow_global<Marketplace>(marketplace_addr);
        assert!(table::contains(&marketplace.products, product_id), EPRODUCT_NOT_FOUND);

        let product = table::borrow(&marketplace.products, product_id);
        (
            product.id,
            product.seller,
            product.name,
            product.description,
            product.price,
            product.image_url,
            product.status,
            product.created_at
        )
    }

    /// View function to get next product ID
    #[view]
    public fun get_next_product_id(marketplace_addr: address): u64 acquires Marketplace {
        assert!(exists<Marketplace>(marketplace_addr), EMARKETPLACE_NOT_INITIALIZED);
        let marketplace = borrow_global<Marketplace>(marketplace_addr);
        marketplace.next_product_id
    }

    #[test_only]
    use std::string;

    #[test(marketplace_owner = @0xcafe, seller = @0x123, buyer = @0x456)]
    public fun test_marketplace_flow(
        marketplace_owner: &signer,
        seller: &signer,
        buyer: &signer,
    ) acquires Marketplace {
        // Initialize marketplace
        initialize(marketplace_owner);

        let marketplace_addr = signer::address_of(marketplace_owner);

        // List a product
        list_product(
            seller,
            marketplace_addr,
            utf8(b"Test Product"),
            utf8(b"A test product"),
            100,
            utf8(b"https://example.com/image.jpg"),
        );

        // Verify product was listed
        let next_id = get_next_product_id(marketplace_addr);
        assert!(next_id == 2, 0);

        // Get product details
        let (id, seller_addr, name, _desc, price, _img, status, _created) =
            get_product(marketplace_addr, 1);

        assert!(id == 1, 1);
        assert!(seller_addr == signer::address_of(seller), 2);
        assert!(price == 100, 3);
        assert!(status == STATUS_ACTIVE, 4);
    }
}
