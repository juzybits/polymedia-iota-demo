module demo::nft;

// === imports ===

use std::{
    string::{String},
};
use iota::{
    display::{Self},
    package::{Self},
};

// === structs ===

public struct Nft has key, store {
    id: UID,
    name: String,
    image_url: String,
    description: String,
}

public struct NFT has drop {}

// === initialization ===

fun init(otw: NFT, ctx: &mut TxContext)
{
    // publisher
    let publisher = package::claim(otw, ctx);

    // display
    let mut disp = display::new<Nft>(&publisher, ctx);
    disp.add(b"name".to_string(), b"{name}".to_string());
    disp.add(b"image_url".to_string(), b"{image_url}".to_string());
    disp.add(b"description".to_string(), b"{description}".to_string());
    display::update_version(&mut disp);

    // transfer objects to the sender
    transfer::public_transfer(publisher, ctx.sender());
    transfer::public_transfer(disp, ctx.sender());
}

// === public-mutative functions ===

public fun new(
    name: vector<u8>,
    image_url: vector<u8>,
    description: vector<u8>,
    ctx: &mut TxContext,
): Nft {
    return Nft {
        id: object::new(ctx),
        name: name.to_string(),
        image_url: image_url.to_string(),
        description: description.to_string(),
    }
}

public fun destroy(
    self: Nft,
) {
    let Nft { id, .. } = self;
    object::delete(id);
}

// === accessors ===

public fun id(self: &Nft): ID { self.id.to_inner() }
public fun name(self: &Nft): String { self.name }
public fun image_url(self: &Nft): String { self.image_url }
public fun description(self: &Nft): String { self.description }
