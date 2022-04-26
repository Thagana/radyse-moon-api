import { Schema, model } from 'mongoose';

interface BookMark {
    user_id: string;
    article_id: string;
    date_saved: string;
}

const schema: Schema = new Schema<BookMark>({
    user_id: {
        type: String,
        required: true,
    },
    article_id: {
        type: String,
        required: true,
    },
    date_saved: {
        type: String,
        required: true,
    }
});

const BookMarkModel = model<BookMark>('BookMarks', schema);

export default BookMarkModel;