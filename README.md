## Getting Started

Clone this repository and run the following
```shell
npm install
```

Once you have installed the modules change lines 28-29 to your specified thumbnail width and height.
```
var   thumbWidth = 180, 
  thumbHeight = 180; //For automatic scalling use -1 or -2 depending on the video codecs
```

## Loading onto Lambda
Simply zip this all contents of the contents of this folder and upload to lambda as a function.
If you are using zip on the command line you can do like this
```
zip -r ../lambda-thumbnailer.zip *
```

## Setup the Lambda Function
Then just go onto AWS Lambda create a new function and give it a trigger of put objects with a suffix filter of *.avi, *.mov etc.. 
Although you don't need this it just reduces the number of invocations. Apply a policy of LambdaExecute to the IAM role (this gives read and write access to s3) then set the memory limit to the maximum (NOTE: I have never reached the maximum with this function, its normally around 700mb even for 4gb mov files) and set timeout for 30seconds (again it normally takes around 6 seconds but its good to be safe).

### Original Tutorial
Originally this was a tutorial I wrote back in July last year, I updated it a bit since then. The original also contained mediainfo. (Available Here)[https://concrete5.co.jp/blog/creating-video-thumbnails-aws-lambda-your-s3-bucket]