const validate = (title: string) => {
    const CATEGORY = ['business', 'general', 'health', 'science', 'sports', 'technology', 'entertainment'];
    if (!CATEGORY.includes(title)) {
        return false;
    }
    return true;
}

export default validate;