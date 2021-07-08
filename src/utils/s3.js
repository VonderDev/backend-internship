const path = require("path");
const fs = require("fs");
const aws = require("aws-sdk");
const mongoose = require("mongoose");
const {
  AWS_BUCKET_NAME,
  AWS_BUCKET_REGION,
  AWS_ACCESS_KEY,
  SECRET_ACCESS_KEY,
} = process.env;
aws.config.setPromisesDependency();
aws.config.update({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: SECRET_ACCESS_KEY,
  region: AWS_BUCKET_REGION,
});
const s3 = new aws.S3();
async function uploadManyFile(files, userId, pathS3) {
  if (mongoose.Types.ObjectId.isValid(userId)) {
    const fileReturn = await Promise.all(
      files.map(async (item, index) => {
        const filePath = path.join(
          __dirname,
          "..",
          "..",
          "uploads",
          item.filename
        );
        const key = pathS3 + "/" + userId + "/" + item.filename + ".jpeg";

        var params = {
          Bucket: AWS_BUCKET_NAME,
          Key: key,
          Body: fs.createReadStream(filePath),
          ContentType: "image/jpeg",
          ACL: "public-read",
        };

        const data = await s3
          .upload(params)
          .promise()
          .then((data) => {
            fs.unlinkSync(filePath);

            return data;
          });

        return data["Location"];
      })
    );

    return fileReturn;
  } else {
    throw {
      message: "userid is not defined",
      status: 404,
    };
  }
}

exports.uploadManyFile = uploadManyFile;

//dowmload a file from 23
