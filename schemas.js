const Basejoi = require('joi');
const sanitizeHTML = require('sanitize-html')
const extension = (joi)=>({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value,helpers){
                const clean = sanitizeHTML(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if(clean !== value)return helpers.error('string.escapeHTML',{value})
                return clean;
            }
        }
    }
});


const joi = Basejoi.extend(extension);


module.exports = joi.object({
    campground: joi.object({
        title: joi.string().required().escapeHTML(),
        location: joi.string().required().escapeHTML(),
        //Image: joi.string().required(),
        price: joi.number().min(10).required(),
        description: joi.string().required().escapeHTML()
    }).required(),
    deleteImages: joi.array()
})




