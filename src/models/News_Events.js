const mongoose = require('mongoose')

const news_eventsSchema = new mongoose.Schema(
    {
        title: {type: String, require: true},
        content: {type: String, require: true},
        img_poster: {type: String, require:true},
        
        publisher: {type: mongoose.Schema.Types.ObjectId,  ref: 'Users', require: true},

    },
    {
        timestamps: true,
    }
);

const News_Events = mongoose.model("News_Events", news_eventsSchema);
module.exports = News_Events;