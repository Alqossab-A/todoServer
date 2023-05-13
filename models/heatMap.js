const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const heatMapSchema = new Schema({
    Year: {
        // type: Number,
        // unique: true,
        // month: {
        //     type: Number
        // }
    },
});

const heatMap = mongoose.model('heatMap', heatMapSchema);

module.exports = heatMap;
