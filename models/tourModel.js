const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');

// Create a Tour schema
const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Tour must have a name'],
            unique: true,
            trim: true,
            maxlength: [40, 'A tour name must have less or equal then 40 characters'],
            minlength: [10, 'A tour name must have more or equal then 10 characters'],
        },
        slug: String,
        duration: {
            type: Number,
            required: [true, 'A tour must hava a duration'],
        },
        maxGroupSize: {
            type: Number,
            required: [true, 'A tour must have a group size'],
        },
        difficulty: {
            type: String,
            required: [true, 'A tour must hava a difficulty'],
            enum: {
                values: ['easy', 'medium', 'difficult'],
                message: 'Difficulty is either: easy, medium, difficult',
            },
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be above 1.0'],
            max: [5, 'Rating must be below 5.0'],
            set: (val) => Math.round(val * 10) / 10,
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
        rating: {
            type: Number,
            default: 4.5,
        },
        price: {
            type: Number,
            required: [true, 'Tour must have a price'],
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator(val) {
                    return val < this.price;
                },
                message: 'Discunt price ({VALUE}) should be below regular price',
            },
        },
        summary: {
            type: String,
            trim: true,
            required: [true, 'A tour must have a summery'],
        },
        description: {
            type: String,
            trim: true,
        },
        imageCover: {
            type: String,
            required: [true, 'A tour must have a cover image'],
        },
        images: [String],
        createAt: {
            type: Date,
            default: Date.now(),
            select: false,
        },
        startDates: [Date],
        secretTour: {
            type: Boolean,
            default: false,
        },
        startLocation: {
            // GeoJSON
            type: {
                type: String,
                default: 'Point',
                enum: ['Point'],
            },
            coordinates: [Number],
            address: String,
            description: String,
        },
        locations: [
            {
                // GeoJSON
                type: {
                    type: String,
                    default: 'Point',
                    enum: ['Point'],
                },
                coordinates: [Number],
                address: String,
                description: String,
                day: Number,
            },
        ],
        guides: [
            {
                // @FIXME:need to discuse
                type: mongoose.Schema.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});

// virtual populate
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id',
});

// This is document middleware it's only worke to .save() and .create() data
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// QUERRY middleware
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } });

    this.start = Date.now();
    next();
});

// @TODO:Poputate for all /^find/ query
// tourSchema.pre(/^find/, function (next) {
//     this.populate({
//         path: 'guides',
//         select: '-__v -passwordChangedAt',
//     });

//     next();
// });

// tourSchema.post(/^find/, function (doc, next) {
//     console.log(`Query takes- ${Date.now() - this.start} ms`);
//     next();
// });

// Aggregation middleware
// tourSchema.pre('aggregate', function (next) {
//     this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//     // console.log(this.pipeline());
//     next();
// });

// Create a Tour model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
