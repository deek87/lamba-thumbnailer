/* eslint-disable linebreak-style */


/** Original tutorial is available at https://concrete5.co.jp/blog/creating-video-thumbnails-aws-lambda-your-s3-bucket
 ** Author: Derek Cameron <derek@concrete5.co.jp>
 ** Copyright: 2020
 **/

const lvt = require("lambda-video-thumbnailer");


exports.handler = function (event, context) {

  const t = new lvt.S3(event.Records[0].s3);

  return t.createThumbnail({

    width: 350,

    height: 250,

    time: "00:00:11"

  });

};