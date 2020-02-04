import Thumbnailer, { S3Thumbnailer, S3Record } from "./thumbnailer";

/** Original tutorial is available at
https://concrete5.co.jp/blog/creating-video-thumbnails-aws-lambda-your-s3-bucket
Author: Derek Cameron <derek@concrete5.co.jp>
Copyright: 2018
 **/

class LambdaThumbnailer  {

  static createFromS3Event(event: S3Record): S3Thumbnailer {
    return new S3Thumbnailer(event);
  }
}

export default function eventThumbnailer(event: S3Record): S3Thumbnailer {return LambdaThumbnailer.createFromS3Event(event);}

export {Thumbnailer, S3Thumbnailer, LambdaThumbnailer};

   /* var child_process = require("child_process"),
        async = require("async"),
        AWS = require("aws-sdk"),
        fs = require("fs"),
        utils = {
            decodeKey: function(key) {
                return decodeURIComponent(key).replace(/\+/g, " ");
                }
        };*/
// Windows zip files dont save permissions...
// This is really only for windows users
/*
child_process.exec('cp /var/task/ffmpeg /tmp/ffmpeg && chmod 755 /tmp/ffmpeg', function (error, stdout, stderr) {
            if (error) {
                console.log('ffmpeg permissions couldnt be set');
                console.log(error);
                console.log(stdout);
                console.log(stderr);
            } else {
                console.log("stdout: " + stdout) // chmod ffmpeg
            }
          });
var s3 = new AWS.S3();
var thumbKeyPrefix = "thumbnails/",
  allowedFileTypes = ;

var   thumbWidth = 180,
  thumbHeight = 180; //For automatic scalling use -1


exports.handler = function(event, context) {
  var tmpFile = fs.createWriteStream("/tmp/screenshot.jpg");
  var srcKey = decodeKey(event.Records[0].s3.object.key),
  bucket = event.Records[0].s3.bucket.name,
  dstKey = thumbKeyPrefix + srcKey.replace(/\.\w+$/, ".jpg"),
  fileType = srcKey.match(/\.\w+$/),
  target = s3.getSignedUrl("getObject",{Bucket:bucket, Key:srcKey, Expires: 900});
  var metadata = {Width: 0, Height: 0};
  if(srcKey.indexOf(thumbKeyPrefix) === 0) {
    return;
  }

  if (fileType === null) {
    context.fail("Invalid filetype found for key: " + srcKey);
    return;
  }

  fileType = fileType[0].substr(1);

  if (allowedFileTypes.indexOf(fileType) === -1) {
    context.fail("Filetype " + fileType + " not valid for thumbnail, exiting");
    return;
  }
  async.waterfall([

      function createThumbnail(next) {

        var width = thumbWidth,
         height = thumbHeight;
        var ffmpeg = child_process.spawn("ffmpeg", [
          "-ss","00:00:05", // time to take screenshot
          "-i", target, // url to stream from
          "-vf", "thumbnail,scale="+thumbWidth+":"+thumbHeight,
          "-qscale:v" ,"2",
          "-frames:v", "1",
          "-f", "image2",
          "-c:v", "mjpeg",
          "pipe:1"
        ]);
        ffmpeg.on("error", function(err, stdout, stderr) {
          console.log(err);
          console.log("ffmpeg stdout:\n" + stdout);
          console.log("ffmpeg stderr:\n" + stderr);
        })
        ffmpeg.on("close", function(code) {
          if (code != 0 ) {
            console.log("child process exited with code " + code);
          } else {
            console.log("Processing finished !");
          }
          tmpFile.end();
          next(code);
        });
        tmpFile.on("error", function(err) {
          console.log("stream err: ", err);
        });
        ffmpeg.on("end", function() {
          tmpFile.end();
        })
        ffmpeg.stdout.pipe(tmpFile)
        .on("error", function(err){
          console.log("error while writing: ",err);
        });
      },

      function uploadThumbnail(next) {
        var tmpFile =  fs.createReadStream("/tmp/screenshot.jpg");
        child_process.exec("echo `ls -l -R /tmp`",
          function (error, stdout, stderr) {
            console.log("stdout: " + stdout) // for checking on the screenshot
          });
        var params ={
            Bucket: bucket,
            Key: dstKey,
            Body: tmpFile,
            ContentType: "image/jpg",
            ACL: "public-read",
            Metadata: {
              thumbnail: "TRUE"
            }
          };

        var uploadMe = s3.upload(params);
        uploadMe.send(
          function(err, data) {
          if (err != null) console.log("error: " +err);
          next(err);
          }
        );
      }
    ],
    function(err) {
      if (err) {
        console.error(
          "Unable to generate thumbnail for '" + bucket + "/" + srcKey + "'" +
          " due to error: " + err
          );
          context.fail(err);
      } else {
        context.succeed("Created thumbnail for '" + bucket + "/" + srcKey + "'");
      }
    }
  );
};
*/