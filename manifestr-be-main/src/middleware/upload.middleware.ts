import multer from 'multer';

// Configure multer to handle file uploads in memory
const storage = multer.memoryStorage();

// File filter for video files
const videoFileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimeTypes = [
        'video/mp4',
        'video/mpeg',
        'video/quicktime',
        'video/x-msvideo',
        'video/x-ms-wmv',
        'video/webm',
        'video/3gpp',
        'video/x-flv',
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only video files are allowed.'));
    }
};

// File filter for image files
const imageFileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only image files are allowed.'));
    }
};

export const uploadVideo = multer({
    storage,
    fileFilter: videoFileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit
    },
});

export const uploadImage = multer({
    storage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
});

// For handling multiple file types (video + image)
export const uploadVideoAndImage = multer({
    storage,
    fileFilter: (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        const isVideo = file.fieldname === 'video';
        const isImage = file.fieldname === 'thumbnail' || file.fieldname === 'display_image';
        
        if (isVideo) {
            return videoFileFilter(req, file, cb);
        } else if (isImage) {
            return imageFileFilter(req, file, cb);
        } else {
            cb(new Error('Invalid field name'));
        }
    },
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit (for video)
    },
});
