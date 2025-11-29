export const defaultCategories = [
    { id: 'all', name: 'All Items' },
    { id: 'starters', name: 'Starters' },
    { id: 'mains', name: 'Mains' },
    { id: 'drinks', name: 'Drinks' },
    { id: 'desserts', name: 'Desserts' },
];

export const defaultMenuItems = [
    {
        id: 1,
        name: 'Himalayan Momos',
        price: 250,
        category: 'starters',
        image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=300&h=200&fit=crop',
        description: 'Steamed dumplings filled with spiced minced chicken.',
        inStock: true,
    },
    {
        id: 2,
        name: 'Crispy Chili Potato',
        price: 200,
        category: 'starters',
        image: 'https://images.unsplash.com/photo-1573821663912-6df460f9c684?w=300&h=200&fit=crop',
        description: 'Fried potato fingers tossed in spicy chili sauce.',
        inStock: true,
    },
    {
        id: 3,
        name: 'Butter Chicken',
        price: 650,
        category: 'mains',
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=200&fit=crop',
        description: 'Tender chicken cooked in a rich tomato and butter gravy.',
        inStock: true,
    },
    {
        id: 4,
        name: 'Paneer Tikka Masala',
        price: 550,
        category: 'mains',
        image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300&h=200&fit=crop',
        description: 'Grilled cottage cheese cubes in spicy curry.',
        inStock: true,
    },
    {
        id: 5,
        name: 'Mango Lassi',
        price: 150,
        category: 'drinks',
        image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=300&h=200&fit=crop',
        description: 'Refreshing yogurt drink with mango pulp.',
        inStock: true,
    },
    {
        id: 6,
        name: 'Masala Chai',
        price: 50,
        category: 'drinks',
        image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=300&h=200&fit=crop',
        description: 'Spiced Indian tea with milk.',
        inStock: true,
    },
    {
        id: 7,
        name: 'Gulab Jamun',
        price: 100,
        category: 'desserts',
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300&h=200&fit=crop',
        description: 'Deep-fried milk solids soaked in sugar syrup.',
        inStock: true,
    },
];

// Helper functions for localStorage
export const getMenuItems = () => {
    const stored = localStorage.getItem('menuItems');
    if (stored) {
        return JSON.parse(stored);
    }
    // Initialize with defaults on first load
    localStorage.setItem('menuItems', JSON.stringify(defaultMenuItems));
    return defaultMenuItems;
};

export const saveMenuItems = (items) => {
    localStorage.setItem('menuItems', JSON.stringify(items));
};

export const getCategories = () => {
    const stored = localStorage.getItem('menuCategories');
    if (stored) {
        return JSON.parse(stored);
    }
    // Initialize with defaults on first load
    localStorage.setItem('menuCategories', JSON.stringify(defaultCategories));
    return defaultCategories;
};

export const saveCategories = (cats) => {
    localStorage.setItem('menuCategories', JSON.stringify(cats));
};

// For backward compatibility
export const menuItems = getMenuItems();
export const categories = getCategories();
