const isAnnotation = (value) => {
    let regexAnnotation = new RegExp("(@.*?)", 'g');
    return regexAnnotation.test(value)
}

export {
    isAnnotation
}