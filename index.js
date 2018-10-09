var app = new Vue({
    el:'#app',
    data(){
        return{
            catId: 31,
            model: {
                id: 0,
                imageList: [],
            },
            typeList: [],
            propList: [],
            provinceList: [],
            province: 0,
            cityList: []
        }
    },
    created() {
     
    },
    mounted() {
    },
    methods: { 
        /**
         * 上传附件
         */
        chooseImage(e) {
            var that = this;
            that.upload(e, {
                folder: "product",
                // success: function (result) {
                //     console.log(result)
                //     result.type = "图片";
                //     that.model.imageList.push(result); 
                // }
            });
        },
        /**
         * 删除附件
         */
        deleteFile(index) {
            this.model.imageList.splice(index);
        }, 
        /**
         * 封装上传附件的方法
         */
        upload(event, options){
            var that = this;
            var defaults = {
                folder: "default",
                size: 3,
                type: ['image', 'word', 'pdf', 'zip', 'rar', 'sheet', 'text'],
                maxWidth: Number, //最大宽度
                maxHeight: Number, //最大高度
                success: false,
                beforeSend: false,
            };
            var opts = $.extend(defaults, options);
            var files = event.target.files; 
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                console.log(file);
                if (file.size > defaults.size * 1024 * 1024) {
                    alert("文件【" + file.name + "】大于" + defaults.size + "M!");
                    return;
                }
                var valiType = false;
                for (var i = 0; i < defaults.type.length; i++) {
                   var item = defaults.type[i];
                   if (file.type.indexOf(item) >= 0) {
                       valiType = true;
                       break;
                   }
                }
                if (!valiType) {
                   alert("上传文件类型不正确！");
                   return;
                }
                if (opts.beforeSend) {
                    opts.beforeSend();
                }
 
                var reader = new FileReader(); 
                reader.readAsDataURL(file);
                reader.onloadstart = function () {
                    //用以在上传前加入一些事件或效果，如载入中...的动画效果
                };
                var type = file.type.split('/')[0];
                if (type != 'image') {
                    reader.onloadend = function () {
                        
                        
                    }
                }
                else {
                    reader.onloadend = function (e) { 
                        var dataURL = this.result;  
                        var imaged = new Image();
                        imaged.src = dataURL;
                        imaged.onload = function () {
                            var img = this;
                            console.log(img);
                            //利用canvas对图片进行压缩
                            var getImg = that.getBase64Image(img,{
                                maxWidth:1000,
                                maxHeight:1000
                            });
                            var lastImg = new Image();
                            lastImg.src = getImg.dataURL;
                            console.log(lastImg.dataURL );
                            document.querySelector('#preview').appendChild(lastImg)
                        };  
                    };
                } 
            }
        },
        /**
         * 图片文件转base64
         */
        getBase64Image:function(img,options){
            var defaults = {
                maxWidth : Number,
                maxHeight : Number
            };
            if(options != undefined && options != null){
                defaults = $.extend(defaults,options)
            };
            // 缩放图片需要的canvas
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            // 图片原始尺寸
            var originWidth = img.width;
            var originHeight = img.height;
            // 最大尺寸限制，可通过国设置宽高来实现图片压缩程度
            var maxWidth = defaults.maxWidth,
                maxHeight = defaults.maxHeight;
            // 目标尺寸
            var targetWidth = originWidth,
                targetHeight = originHeight;
            // 图片尺寸超过400x400的限制
            if(originWidth > maxWidth || originHeight > maxHeight) {
                if(originWidth / originHeight > maxWidth / maxHeight) {
                    // 更宽，按照宽度限定尺寸
                    targetWidth = maxWidth;
                    targetHeight = Math.round(maxWidth * (originHeight / originWidth));
                } else {
                    targetHeight = maxHeight;
                    targetWidth = Math.round(maxHeight * (originWidth / originHeight));
                }
            }
            // canvas对图片进行缩放
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            // 清除画布
            context.clearRect(0, 0, targetWidth, targetHeight);  
            // 图片压缩
            context.drawImage(img, 0, 0, targetWidth, targetHeight);  
            /*第一个参数是创建的img对象；第二个参数是左上角坐标，后面两个是画布区域宽高*/
            //压缩后的图片base64 url
            /*canvas.toDataURL(mimeType, qualityArgument),mimeType 默认值是'image/jpeg';
                * qualityArgument表示导出的图片质量，只要导出为jpg和webp格式的时候此参数才有效果，默认值是0.92*/
            dataURL = canvas.toDataURL('image/jpeg');
            //回调函数用以向数据库提交数据
            var base64 = dataURL.substr(dataURL.indexOf(",") + 1);
            return {dataURL,base64};
        }
    }
})