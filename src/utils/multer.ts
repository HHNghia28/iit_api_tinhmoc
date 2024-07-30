import { diskStorage } from 'multer';
// import { extname } from 'path';

export const storage = diskStorage({
  // destination: function (req, file, cb) {
  //   cb(null, 'uploads/');
  // },
  destination: 'uploads/',
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '.' + file.originalname.split('.').pop());
  },
});

// const storage = diskStorage({
//   destination: './uploads/', // Define your path here
//   filename: (req, file, cb) => {
//     const randomName = Array(32)
//       .fill(null)
//       .map(() => Math.round(Math.random() * 16).toString(16))
//       .join('');
//     cb(null, `${randomName}${extname(file.originalname)}`);
//   },
// });
