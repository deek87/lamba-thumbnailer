![Build](https://github.com/deek87/lamba-thumbnailer/workflows/Build/badge.svg?branch=master)

# IMPORTANT
This branch is currently under development and is provided as is
# Roadmap for TypeScript
  - [x] Convert All Code to TypeScript (done)
  - [x] Use FFmpeg Layers for Lambda instead (done)
  - [ ] Make the thumbnailer more moduler (in-progress)
  - [ ] Implement Tests (to be done)


# Table Of Contents
- [Introduction](#Introduction)
- [Getting Started](#Getting-Started)
  - [Using in your own function](#Using-in-your-own-function)
- [Thumbnail Configuration](#Thumbnail-Configuration)
  - [Size](#Size)
  - [Type](#Type)
  - [Quality](#Quality)
  - [Output Location](#Output-Location)
- [Original Tutorial](#Original-Tutorial)

- [License](#License)

## Introduction
This package was created to automatically generate thumbnails from s3 video uploads.

## Getting Started
Install this package using the following the command then require the package in your code.
```
npm install lambda-video-thumbnailer
```

### Using in your own function
You can use [the provided example.js](example.js) to get you started.
Or you can use the following code snippet for a lambda function.
```
// Require the library
const lvt = require("lambda-video-thumbnailer");


exports.handler = function(event, context) {

// Returns a S3Thumbnailer Class
const t = new lvt.S3(event.Records[0].s3);
// Create a thumbnail will return promise<string>
return t.createThumbnail({

  width: 100, 

  height: 100,

  time: "00:00:05",

  type: "webp"

});

};

```

## Thumbnail Configuration
`createThumbnail()` takes a `thumbnailConfig` object with that has the following default options

```
{
  prefix: "thumbnails/",
  width: 180,
  height: 180,
  time: "00:00:05",
  type: "jpg",
  quality: 2
}
```
### Size
To configure the output size of thumbnails simply supply a width/height number. If you want to automatically calculate width or height based on the aspect ratio of the input, just use -1. For example:
```
{
  width: 700,
  height: -1
}
```
This will produce a 700x300 image when the input aspect ratio is 21:9

If your output needs to be a multiple of n then supply -n and it will output an output that is scaled by the ratio and a multiple of -n. For example
```
{
  width: -3,
  height: 250
}
```
This will produce a 441x250 image when the aspect raito is 21:9
### Type
To configure the output type of thumbnails just set the type to `"jpg"`, `"png"` or `"webp"`
```
{
  type: "webp"
}
```
NOTE: ffmpeg with png tends to output very large filesizes even with -pred mixed
### Quality
The output quality of the thumbnail is controlled by the `quality` property. It is controlled on a scale of 1-10 with 1 being the best quality and 10 being the worst quality.
```
{
  quality: 1
}
```
### Output Location
By default the output of files is determined by prefix

## Setup the Lambda Function
This package requires a ffmpeg layer to function. You can use the following arns:
- [Asia](#Asia)
- [Europe](#Europe)
- [Canada](#Canada)
- [United States](#United-States)
- [South America](#South-America)

Or alternatively use the serverlesspub build (only available in ap-us-east-1)
arn:aws:lambda:us-east-1:145266761615:layer:ffmpeg:4 or build your own from their github repo [serverlesspub/ffmpeg-aws-lambda-layer](https://github.com/serverlesspub/ffmpeg-aws-lambda-layer)

Then just go onto AWS Lambda create a new function and give it a trigger of put objects with a suffix filter of *.avi, *.mov etc.. 

Although you don't need to do this it just reduces the number of invocations. Apply a policy of LambdaExecute to the IAM role (this gives read and write access to s3) then set the memory limit to the maximum* and set timeout for 30seconds (again it normally takes around 6 seconds but its good to be safe).

*NOTE: I have never reached the maximum with this function, its normally around 700mb even for 4gb mov files

## Lambda Layers
### Asia
`arn:aws:lambda:ap-east-1:260572601982:layer:ffmpeg:1` - Hong Kong (AP East 1)
`arn:aws:lambda:ap-south-1:260572601982:layer:ffmpeg:1` - Mumbai (AP South 1)
`arn:aws:lambda:ap-northeast-2:260572601982:layer:ffmpeg:1` - Seoul (AP Northeast 2)
`arn:aws:lambda:ap-southeast-1:260572601982:layer:ffmpeg:1` - Singapore (AP Southeast 1)
`arn:aws:lambda:ap-southeast-2:260572601982:layer:ffmpeg:1` - Sydney (AP Southeast 2)
`arn:aws:lambda:ap-northeast-1:260572601982:layer:ffmpeg:1` - Tokyo (AP Northeast 1)

### Europe
`arn:aws:lambda:eu-central-1:260572601982:layer:ffmpeg:1` - Frankfurt (EU Central 1)
`arn:aws:lambda:eu-west-1:260572601982:layer:ffmpeg:1` - Ireland (EU West 1)
`arn:aws:lambda:eu-west-2:260572601982:layer:ffmpeg:1` - London (EU West 2)
`arn:aws:lambda:eu-west-3:260572601982:layer:ffmpeg:1` - Paris (EU West 3)
`arn:aws:lambda:eu-north-1:260572601982:layer:ffmpeg:1` - Stockholm (EU North 1)

### Canada
`arn:aws:lambda:ca-central-1:260572601982:layer:ffmpeg:1` - Central (CA Central 1)

### South America
`arn:aws:lambda:sa-east-1:260572601982:layer:ffmpeg:1` - São Paulo (SA East 1)

### United States
`arn:aws:lambda:us-east-1:260572601982:layer:ffmpeg:1` - North Viginia (US East 1)
`arn:aws:lambda:us-east-2:260572601982:layer:ffmpeg:1` - Ohio (US East 2)
`arn:aws:lambda:us-west-1:260572601982:layer:ffmpeg:1` - N. California (US West 1)
`arn:aws:lambda:us-west-2:260572601982:layer:ffmpeg:1` - Oregon (US West 2)


## Original Tutorial
Originally this was a tutorial I wrote back in July 2017, I updated it a bit since then. The original also contained mediainfo. [Available Here](https://concrete5.co.jp/blog/creating-video-thumbnails-aws-lambda-your-s3-bucket)

## License
[MIT](LICENSE)