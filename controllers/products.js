const Product = require('../models/product')

const getAllProductsStatic = async (req, res) => {
    const products = await Product.find({})
    .sort('name')
    .select('name')
    /* .limit(10) */
    res.status(200).json({nbHits:products.length, products})    
}

const getAllProducts = async (req, res) => {
    const {featured, company, name, sort, fields, numericFilters} = req.query
    const queryObject = {}

    if (featured) {
        queryObject.featured = featured === 'true' ? true : false ; 
    }
    if (company) {
        queryObject.company = company
    }
    if (name) { 
        queryObject.name = { $regex: name, $options: "i" };
    }
    if (numericFilters) {
        const operatorMap = {
            ">": "$gt",
            ">=": "$gte",
            "<": "$lt",
            "<=": "$lte",
            "=": "$eq",
        };
        const regEx = /\b(<|>|<=|>=|=)\b/g
        let filters = numericFilters.replace(regEx, 
            (match) => `-${operatorMap[match]}-`)
        const options = ['price', 'rating']
        filters = filters.split(',').forEach(element => {
            const [field, operator, value] = element.split('-')
            if (options.includes(field)) {
                queryObject[field] = {[operator]: Number(value)}
            }
        });
    }
        
    // console.log(queryObject)
    let result = Product.find(queryObject)
    
    if (sort) {
        console.log(sort)
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    } else {
        result.sort('createdAt')
    }

    if (fields) {
        const fieldList = fields.split(',').join(' ')
        result = result.select(fieldList)
    }

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page-1)*limit
    
    result = result.skip(skip).limit(limit)
    const products = await result
    res.status(200).json({nbHits:products.length, products})    
}   


module.exports = {getAllProducts, getAllProductsStatic}