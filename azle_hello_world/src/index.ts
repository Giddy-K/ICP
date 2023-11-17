import { Canister, AzleVoid, query, update, text, Principal, Record, bool, Void } from 'azle';

// NFT card structure
interface NFTCard {
    id: string;
    name: string;
    rarity: string;
    owner: Principal;
}

// Method to generate a random sample card
function generateRandomCard(owner: Principal): NFTCard {
    const id = generateUniqueID();
    const names: string[] = ['Card A', 'Card B', 'Card C']; 
    const rarities: string[] = ['Common', 'Rare', 'Epic', 'Legendary']; 

    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomRarity = rarities[Math.floor(Math.random() * rarities.length)];

    return {
        id,
        name: randomName,
        rarity: randomRarity,
        owner,
    } as NFTCard;

    
}

// Function to generate a unique ID for cards
function generateUniqueID(): string {
    return (
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)
    );
}

// Collection of NFT cards
let cardCollection: NFTCard[] = [];

export default Canister({
    // Get all available NFT cards
    getAllCards: query([], Array(Record({ id: text, name: text, rarity: text, owner: Principal })), () => {
        return cardCollection.map((card: NFTCard) => ({
            id: card.id,
            name: card.name,
            rarity: card.rarity,
            owner: card.owner,
        }));
    }),

    // Get owned cards by a player
    getOwnedCards: query([Principal], Array(Record({ id: text, name: text, rarity: text })), (playerId: Principal) => {
        return cardCollection
            .filter((card: NFTCard) => card.owner.toString() === playerId.toString())
            .map((card: NFTCard) => ({
                id: card.id,
                name: card.name,
                rarity: card.rarity,
            }));
    }),

    // Mint a new NFT card
    mintCard: update([text, text, text, Principal], text, (playerId, cardName, rarity, owner) => {
        const newCard = generateRandomCard(owner);
        cardCollection.push(newCard);
        return newCard.id;
    }),

    // Transfer ownership of a card
    transferCard: update([text, Principal], bool, (cardId, newOwner) => {
        const cardIndex = cardCollection.findIndex((card: NFTCard) => card.id === cardId);
        if (cardIndex !== -1) {
            cardCollection[cardIndex].owner = newOwner;
            return true; // Successful transfer
        }
        return false; // Card not found or transfer failed
    }),
});