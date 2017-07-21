/**
 * Created by rfang on 2017/7/21.
 */
//实例化一个plupload上传对象

var uploader = new plupload.Uploader({
  browse_button : 'browse', //触发文件选择对话框的按钮，为那个元素id
  url : '/', //服务器端的上传页面地址
  flash_swf_url : 'js/Moxie.swf', //swf文件，当需要使用swf方式进行上传时需要配置该参数
  silverlight_xap_url : 'js/Moxie.xap' //silverlight文件，当需要使用silverlight方式进行上传时需要配置该参数
});

//在实例对象上调用init()方法进行初始化
uploader.init();

//绑定各种事件，并在事件监听函数中做你想做的事
uploader.bind('FilesAdded',function(uploader,files){
  $.each(files, function(){

    var img = new mOxie.Image();

    img.onload = function() {
      this.embed($('#preview').get(0), {
        width: 100,
        height: 100,
        crop: true
      });
    };

    img.onembedded = function() {
      this.destroy();
    };

    img.onerror = function() {
      this.destroy();
    };

    img.load(this.getSource());

  });

});
uploader.bind('UploadProgress',function(uploader,file){
  //每个事件监听函数都会传入一些很有用的参数，
  //我们可以利用这些参数提供的信息来做比如更新UI，提示上传进度等操作
});

uploader.bind('FileUploaded', function (uploader,file,responseObject) {
  $('#logo-value').val(responseObject.response)
});

//最后给"开始上传"按钮注册事件
document.getElementById('start_upload').onclick = function(event){
  event.preventDefault();
  uploader.start(); //调用实例对象的start()方法开始上传文件，当然你也可以在其他地方调用该方法
};

