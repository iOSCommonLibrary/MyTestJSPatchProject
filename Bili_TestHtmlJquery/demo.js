/**
 * Created by suwei on 16/7/13.
 */
require('UIButton,UIWindow,UIView,UIFont,NSMutableString,UITapGestureRecognizer,SWBaseViewController,NSMutableArray,SWTabBarController,UINavigationController,SWHomeViewController,SWCategoryController,SWConcernViewController,SWSearchViewController,SWPlayerUserCenterViewController,JPViewController,UITabBarController,NSArray,UITableView,UIScreen,UIViewController,AppDelegate, UIImageView, UIImage, UIScreen,UITableViewCell,UILabel, NSURL, NSURLRequest,NSURLConnection,NSOperationQueue');
require('UIColor,NSURLResponse,NSData,NSError,NSJSONSerialization,NSDictionary,NSArray, UIViewController,SWTableViewCell');
require('JPEngine').addExtensions(['JPMemory']);
require('SWContainerView,UIScrollView,SWTopBar,SWLabel');
require('SWTableView,NSDateFormatter,NSDate,NSCalendar');
require('SWHomeBangumiViewController,SWHomeBangumiNewBangumiLoadCell,SWHomeBangumiNewChangLoadItem,SWHomeBangumiDidEndCell,SWHomeBangumiDidEndItem,SWHomeBangumiRecommendCell');
var button
var mainColor = UIColor.colorWithRed_green_blue_alpha(251./255,114./255,153./255,1);
//app代理--------------------------//app代理--------------------------//app代理--------------------------//app代理--------------------------//app代理--------------------------//app代理--------------------------
defineClass('AppDelegate : UIResponder',{
    configRootView:function(){
        //self.ORIGconfigRootView();
        console.log("会有效果吗");
        self.setWindow(UIWindow.alloc().initWithFrame(UIScreen.mainScreen().bounds()));
        var tab = SWTabBarController.alloc().init();
        var nav = UINavigationController.alloc().initWithRootViewController(tab);
        self.window().setRootViewController(nav)  ;
        self.window().makeKeyAndVisible();
    }
})

//自定义tabbarVC-----------------------//自定义tabbarVC-----------------------//自定义tabbarVC-----------------------//自定义tabbarVC-----------------------//自定义tabbarVC-----------------------
defineClass('SWTabBarController:UITabBarController',{
        viewDidLoad:function(){
            self.super().viewDidLoad();
            var vcs = NSArray.arrayWithObjects(SWHomeViewController.alloc().init(),SWCategoryController.alloc().init(),SWConcernViewController.alloc().init(),SWSearchViewController.alloc().init(),SWPlayerUserCenterViewController.alloc().init(),null);
            self.setViewControllers(vcs);
        }
        })

// SW 首页------------------------------------------// SW 首页------------------------------------------// SW 首页------------------------------------------// SW 首页------------------------------------------


defineClass("SWHomeViewController: SWBaseViewController<UITableViewDataSource,UITableViewDelegate>", {
    init:function(){
        if(self.ORIGinit()){
            var normalImage = UIImage.imageNamed("home_home_tab");
            var selectImage = UIImage.imageNamed("home_home_tab_s");
            normalImage = normalImage.imageWithRenderingMode(1);
            selectImage = selectImage.imageWithRenderingMode(1);
            self.tabBarItem().setImage(normalImage);
            self.tabBarItem().setSelectedImage(selectImage);

            self.setProp_forKey("http://bangumi.bilibili.com/sponsor/rank/get_sponsor_week_list?access_key=5e0df12c70fcf9a5b20a2a8dcb956ca1&actionKey=appkey&appkey=27eb53fc9058f8c3&build=3445&device=phone&mobi_app=iphone&page=1&pagesize=100&platform=ios&season_id=5027&sign=6dfbe4193ec84aed0ef3e38d1f810ec4&ts=1468406428",'urlStr');

        }
        return self;
    },
    viewDidLoad:function(){
        self.super().viewDidLoad();
        button = UIButton.alloc().init();
        self.view().setBackgroundColor(mainColor);
        button.setBackgroundColor(UIColor.redColor());
        button.setFrame({x:20, y:64, width:100, height:100});
        button.addTarget_action_forControlEvents(self,'click:',1<<6);
        button.setTag(1);
        var tableView = UITableView.alloc().initWithFrame(UIScreen.mainScreen().bounds());
        self.view().addSubview(tableView);
        tableView.setRowHeight(80);
        tableView.setDataSource(self);
        tableView.setDelegate(self);
        tableView.registerClass_forCellReuseIdentifier(SWTableViewCell.class(),"cell");
        var sel = self;
        var btn = UIButton.alloc().initWithFrame({x:100, y:100, width:100, height:100});
        self.view().addSubview(btn);
        btn.setBackgroundColor(UIColor.redColor());
        btn.rac__signalForControlEvents(1 <<  6).subscribeNext(block("id",function(x){
            console.log("真实吊炸了，也可以直接调用RAC");
            var contain = SWContainerView.alloc().init();
            contain.setFrame(sel.view().bounds());
            var vc1 = SWHomeViewController.alloc().init();
            vc1.setTitle("直播");
            vc1.view().setBackgroundColor(UIColor.redColor());

            var vc2 = SWHomeViewController.alloc().init();
            vc2.view().setBackgroundColor(UIColor.blueColor());
            vc2.setTitle("推荐");
            var vc3 = SWHomeBangumiViewController.alloc().init();
            vc3.setTitle("番剧");
            vc3.view().setBackgroundColor(UIColor.whiteColor());
            contain.installViewControllers(NSArray.arrayWithObjects(vc1,vc2,vc3,null));
            sel.view().addSubview(contain);
        }));
        var url= NSURL.URLWithString(self.getProp('urlStr'));
        var request = NSURLRequest.alloc().initWithURL(url);
//        现在JSPatch除了不支持 动态调用C函数 和 一些特殊结构体之外，几乎什么都支持了。
        NSURLConnection.sendAsynchronousRequest_queue_completionHandler(request,NSOperationQueue.mainQueue(),block("NSURLResponse* ,NSData*, NSError*",function(response,data,error) {
            if(!error){
                var NSJSONReadingMutableContainers = 1 << 0;
                var dict = NSJSONSerialization.JSONObjectWithData_options_error(data,NSJSONReadingMutableContainers,null);
                if(dict.isKindOfClass(NSDictionary.class())){
                    dict = dict.objectForKey('result');
                    var array = dict.objectForKey('list');
                    sel.setProp_forKey(array, "data");
                    var data = sel.getProp("data");
                    tableView.reloadData();
                }
            }else{
                console.log("请求失败");
                console.log(error)
            }

        }));
    },
    viewWillAppear:function(animation){
        self.super().viewWillAppear(animation);
        self.navigationController().setNavigationBarHidden_animated(1,1);

    },
    tableView_didSelectRowAtIndexPath: function (tableView, indexPath) {
        tableView.deselectRowAtIndexPath_animated(indexPath,1);
        var vc = require('SWHomeSecondViewController').alloc().init();
        vc.view().setBackgroundColor(UIColor.yellowColor());
        self.navigationController().pushViewController_animated(vc,1);
    },
    tableView_numberOfRowsInSection: function (tableView, section) {
        if(self.getProp("data").count() > 0){
            return self.getProp("data").count();
        }else{
            return 20;
        }

    },
    tableView_cellForRowAtIndexPath: function (tableView, indexPath) {
        var cell = tableView.dequeueReusableCellWithIdentifier("cell");
        if(self.getProp("data").count() > 0){
            var dict = self.getProp("data").objectAtIndex(indexPath.row());
            cell.installData_indexPath(dict,indexPath);
        }else{
        //    cell.textLabel().setText("春节");
        }
        return cell;
    },
    lazyImageView:function(){
        var imageView = UIImageView.alloc().initWithFrame({x:0, y:0, width:375, height:UIScreen.mainScreen().bounds().height });
        imageView.setUserInteractionEnabled(1);
        var tap = require('UITapGestureRecognizer').alloc().initWithTarget_action(self,'tapClick:');
        imageView.addGestureRecognizer(tap);
        imageView.setContentMode(1);
        imageView.setBackgroundColor(UIColor.blackColor());
        return imageView;
    },
    click:function(btn){
        //console.log(btn);
        if(btn.tag() == 1){
            self.view().setBackgroundColor(UIColor.whiteColor());
            button.setBackgroundColor(UIColor.redColor());
            btn.setTag(2);
        }else{
            self.view().setBackgroundColor(UIColor.yellowColor());
            button.setBackgroundColor(UIColor.blueColor());
            btn.setTag(1);
        }
    },
    tapClick:function(tap){
        tap.view().removeFromSuperview();

    }
})




//自定义cell------------------------//自定义cell------------------------//自定义cell------------------------//自定义cell------------------------//自定义cell------------------------

defineClass("SWTableViewCell: UITableViewCell", {
    dealloc:function(){
        console.log(self.class());
    }
})
defineClass("SWTableViewCell: UITableViewCell",{
    //- (instancetype)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(nullable NSString *)reuseIdentifier
    initWithStyle_reuseIdentifier:function(style,reuseIdentifier){

        if(self = self.ORIGinitWithStyle_reuseIdentifier(style,reuseIdentifier)){
            self.configSubview();
        }
        return self;
    }
})
//子控件初始化 SWTableViewCell    SWTableViewCell 数据赋值-------------------------------------

defineClass("SWTableViewCell: UITableViewCell", {
    configSubview:function(){
        var iconImage = UIImageView.alloc().initWithFrame({x:10,y:10,width:60,height:60});
        iconImage.layer().setCornerRadius(30);
        iconImage.setClipsToBounds(1);
        self.contentView().addSubview(iconImage);
        self.setProp_forKey(iconImage,"iconImage");
        var nameLabel = UILabel.alloc().initWithFrame({x:90,y:20,width:200,height:25});
        self.contentView().addSubview(nameLabel);
        self.setProp_forKey(nameLabel,"nameLabel");
        var messageLabel = UILabel.alloc().initWithFrame({x:90,y:40,width:200,height:25});
        self.contentView().addSubview(messageLabel);
        self.setProp_forKey(messageLabel,"messageLabel");
    },
    installData_indexPath:function(dict,indexPath){
        var urlStr = dict.objectForKey('face');
        var name = dict.objectForKey('uname');
        var message = dict.objectForKey('message');
        var url = NSURL.URLWithString(urlStr);
        self.getProp("iconImage").sd__setImageWithURL(url);
        self.getProp("nameLabel").setText(name);
        if(indexPath.row()<3&&indexPath.row()>=0){
            self.getProp("nameLabel").setTextColor(UIColor.colorWithRed_green_blue_alpha(251./255,114./255,153./255,1));
        }else{
            self.getProp("nameLabel").setTextColor(UIColor.blackColor());
        }
        if(!(message.length())){
            self.getProp("messageLabel").setText("没有留言");
        }else{
            self.getProp("messageLabel").setText(message);
        }

    }
})


//SW 首页番剧页面
defineClass("SWHomeBangumiViewController:SWBaseViewController<UITableViewDataSource,UITableViewDelegate>",{
    init:function(){
        if(self.ORIGinit()){
            self.setProp_forKey("http://bangumi.bilibili.com/api/app_index_page_v3?actionKey=appkey&appkey=27eb53fc9058f8c3&build=3431&device=phone&mobi_app=iphone&platform=ios&sign=8344bb7cee65b65db06625379578aaf5&ts=1469931813","urlStr");
            self.setProp_forKey("http://bangumi.bilibili.com/api/bangumi_recommend?actionKey=appkey&appkey=27eb53fc9058f8c3&build=3431&cursor=0&device=phone&mobi_app=iphone&pagesize=10&platform=ios&sign=25e11a7b34c5e8fa943e359f03340f82&ts=1469931987","recommendUrlStr");
        }
        return self;
    },
    viewDidLoad:function(){
        self.super().viewDidLoad();
        var tableView = SWTableView.alloc().initWithFrame(self.view().bounds());
        self.view().addSubview(tableView);
        self.setProp_forKey(tableView,"tableView");
        tableView.registerClass_forCellReuseIdentifier(SWHomeBangumiNewBangumiLoadCell.class(),SWHomeBangumiNewBangumiLoadCell.description());
        tableView.setDataSource(self);
        tableView.setDelegate(self);
        self.loadAndHandleData();
    },
    //datasource and delegate
    numberOfSectionsInTableView:function(tableView){
        return self.getProp("totalArray").count();
    },
    tableView_numberOfRowsInSection:function(tableView,section){
        if(section == 3){
            return self.getProp("totalArray").objectAtIndex(section).count();
        }else{
            return 1;
        }
    },
    tableView_cellForRowAtIndexPath:function(tableView,indexPath){
        if(indexPath.section() == 1){
            var cell = tableView.dequeueReusableCellWithIdentifier(SWHomeBangumiNewBangumiLoadCell.description());
            cell.installData(self.getProp("totalArray").objectAtIndex(indexPath.section()));
            return cell;
        }
        return UITableViewCell.new();
    },
    tableView_heightForRowAtIndexPath:function(tableView,indexPath){
        if(indexPath.section() == 1){

          return SWHomeBangumiNewBangumiLoadCell.getHeight();
        }
        return 50;
    },
    tableView_viewForHeaderInSection:function(tableView,section){
        var view = UIView.alloc().init();
        view.setBackgroundColor(UIColor.redColor());
        return view;
    },
    tableView_heightForHeaderInSection:function(tableView,section){
        return 20;
    },
    loadAndHandleData:function(){
        var url= NSURL.URLWithString(self.getProp('urlStr'));
        var request = NSURLRequest.alloc().initWithURL(url);
        var sel = self;
        NSURLConnection.sendAsynchronousRequest_queue_completionHandler(request,NSOperationQueue.mainQueue(),block("NSURLResponse* ,NSData*, NSError*",function(response,data,error) {
            if(!error){
                var totalArray = NSMutableArray.new();
                var NSJSONReadingMutableContainers = 1 << 0;
                var dict = NSJSONSerialization.JSONObjectWithData_options_error(data,NSJSONReadingMutableContainers,null);
                //番剧连载
                var listArray= dict.objectForKey("result").objectForKey("latestUpdate").objectForKey("list");
                //banner 封面
                var bannersArray = dict.objectForKey("result").objectForKey("banners");
                //完结动画
                var endsArray = dict.objectForKey("result").objectForKey("ends");
                var recommendUrl= NSURL.URLWithString(sel.getProp('recommendUrlStr'));
                var request = NSURLRequest.alloc().initWithURL(recommendUrl);
                totalArray.addObject(bannersArray);
                totalArray.addObject(listArray);
                totalArray.addObject(endsArray);
                sel.setProp_forKey(totalArray,"totalArray");
//        现在JSPatch除了不支持 动态调用C函数 和 一些特殊结构体之外，几乎什么都支持了。
                NSURLConnection.sendAsynchronousRequest_queue_completionHandler(request,NSOperationQueue.mainQueue(),block("NSURLResponse* ,NSData*, NSError*",function(response,data,error) {
                    if(!error){
                        var NSJSONReadingMutableContainers = 1 << 0;
                        var dict = NSJSONSerialization.JSONObjectWithData_options_error(data,NSJSONReadingMutableContainers,null);
                        //番剧推荐
                        if(dict.isKindOfClass(NSDictionary.class())){
                            var recommendArray= dict.objectForKey("result");
                            sel.getProp("totalArray").addObject(recommendArray);
                            sel.getProp("tableView").reloadData();
                        }
                    }else{
                        console.log("请求失败");
                        console.log(error)
                    }
                }));
            }else{
                console.log("请求失败");
                console.log(error)
            }

        }));
    }
})
//SW 首页番剧页面中子控件
//头部无限轮播控件(尽量封装减少耦合性，因为有很多别的地方会用到)
defineClass("SWCircleView:UIView",{

})
//SW 首页番剧中 带有6个item的新番连载自定义视图  新番连载视图
defineClass("SWHomeBangumiNewBangumiLoadCell:UITableViewCell",{
    initWithStyle_reuseIdentifier:function(style,reuseIdentifier){
        if(self.ORIGinitWithStyle_reuseIdentifier(style,reuseIdentifier)){
            self.contentView().setBackgroundColor(UIColor.yellowColor());

            var itemArray = NSMutableArray.new();
            var itemOne = SWHomeBangumiNewChangLoadItem.new();
            itemArray.addObject(itemOne);
            self.setProp_forKey(itemOne,"itemOne");
            self.contentView().addSubview(itemOne);

            var itemTwo = SWHomeBangumiNewChangLoadItem.new();
            itemArray.addObject(itemTwo);
            self.setProp_forKey(itemTwo,"itemTwo");
            self.contentView().addSubview(itemTwo);

            var itemThree = SWHomeBangumiNewChangLoadItem.new();
            itemArray.addObject(itemThree);
            self.setProp_forKey(itemThree,"itemThree");
            self.contentView().addSubview(itemThree);

            var itemFour = SWHomeBangumiNewChangLoadItem.new();
            itemArray.addObject(itemFour);
            self.setProp_forKey(itemFour,"itemFour");
            self.contentView().addSubview(itemFour);

            var itemFive = SWHomeBangumiNewChangLoadItem.new();
            itemArray.addObject(itemFive);
            self.setProp_forKey(itemFive,"itemFive");
            self.contentView().addSubview(itemFive);

            var itemSix = SWHomeBangumiNewChangLoadItem.new();
            itemArray.addObject(itemSix);
            self.setProp_forKey(itemSix,"itemSix");
            self.contentView().addSubview(itemSix);

            self.setProp_forKey(itemArray,"itemArray");


        }
        return self;
    },
        installData:function(array){
            if(array.count() <= 0){
                return;
            }
            var itemArray = self.getProp("itemArray")
            for(var i =0; i < itemArray.count(); i++){
                var item = itemArray.objectAtIndex(i);
                if(i < array.count()){
                    var model = array.objectAtIndex(i);
                    item.installData(model);
                }
            }
        },

        layoutSubviews:function(){
        self.super().layoutSubviews();
        var margin = 12;
        var totalWidth = UIScreen.mainScreen().bounds().width;
        var width = (totalWidth - (3 * margin))/2;
        var coverImageScale = 108/174;
        var coverImageHeight = width * coverImageScale;
        //coverImage为封面图片高度， 17 为titleLable的高度  14.5 为下面的timeLabel(显示更新时间 和 第几话的label)的高度 12为底部默认留的间距 还有1个12为title和time的间距
        var itemHeight = coverImageHeight + 17 + 12 + 14.5 + 12;
        //偶数item的x值
        var evenX = totalWidth - width - margin;

             self.getProp("itemOne").setFrame({x:12, y:0, width:width, height:itemHeight});
             self.getProp("itemTwo").setFrame({x:evenX, y:0, width:width, height:itemHeight});
             self.getProp("itemThree").setFrame({x:12, y:itemHeight , width:width, height:itemHeight});
             self.getProp("itemFour").setFrame({x:evenX, y:itemHeight , width:width, height:itemHeight});
             self.getProp("itemFive").setFrame({x:12, y:itemHeight  * 2, width:width, height:itemHeight});
             self.getProp("itemSix").setFrame({x:evenX, y:itemHeight * 2, width:width, height:itemHeight});

    }
},
    {
        getHeight:function(){
            var margin = 12;
            var totalWidth = UIScreen.mainScreen().bounds().width;
            var width = (totalWidth - (3 * margin))/2;
            var coverImageScale = 108/174;
            var coverImageHeight = width * coverImageScale;
            //coverImage为封面图片高度， 17 为titleLable的高度 6为titleLabel和timeLabel的间距  14.5 为下面的timeLabel的高度 12为底部默认留的间距
            var itemHeight = coverImageHeight + 17 + 12 + 14.5 + 6 + 12;
            return itemHeight * 3;
        }
    })
//SW 首页番剧中watchCount 的item  新番连载视图中的item
defineClass("SWHomeBangumiNewChangLoadItem:UIView",{
    init:function(){
      if(self.ORIGinit()){
        var coverImage = UIImageView.new();
          self.addSubview(coverImage);
          coverImage.layer().setCornerRadius(5);
          coverImage.setClipsToBounds(1);
          self.setProp_forKey(coverImage,"coverImage");

          var watchBGimageView = UIImageView.new();
          self.addSubview(watchBGimageView);
          self.setProp_forKey(watchBGimageView,"watchBGimageView");

          var watchCountLabel = SWLabel.new();
          watchCountLabel.installVerticalAlignment(103);
          watchBGimageView.addSubview(watchCountLabel);
          watchCountLabel.setFont (UIFont.systemFontOfSize(12));
          watchCountLabel.setTextAlignment(1);
          self.setProp_forKey(watchCountLabel,"watchCountLabel");

          var titleLabel = UILabel.new();
          titleLabel.setFont (UIFont.systemFontOfSize(13));
          self.addSubview(titleLabel);
          self.setProp_forKey(titleLabel,"titleLabel");

          var timeLabel = UILabel.new();
          timeLabel.setFont (UIFont.systemFontOfSize(12));
          timeLabel.setTextColor(mainColor);
          self.addSubview(timeLabel);
          self.setProp_forKey(timeLabel,"timeLabel");
      }
        return self;
    },
    installData:function(model){
        var urlStr = model.objectForKey("cover");
        var title = model.objectForKey("title");
        var timeStr = self.handleTimetemp_index(model.objectForKey("last_time"),model.objectForKey("newest_ep_index"));
        var url = NSURL.URLWithString(urlStr);
        self.getProp("coverImage").sd__setImageWithURL(url);
        var watchingCount = model.objectForKey("watchingCount").integerValue();
        if(watchingCount > 8000){
            self.getProp("watchBGimageView").setImage(UIImage.imageNamed("watching_tag"));
        }else{
            if(watchingCount <= 10){
                self.getProp("watchBGimageView").setHidden(1);
            }
            self.getProp("watchBGimageView").setImage(UIImage.imageNamed("watching_tag_black"));
        }
        if(watchingCount > 9999){
            var tempWatch = watchingCount/10000
            self.getProp("watchCountLabel").setText(tempWatch.toFixed(2) + "万人在看");
        }else{
            self.getProp("watchCountLabel").setText(watchingCount + "人在看");
        }

        self.getProp("titleLabel").setText(title);
        //coverImage为封面图片高度， 17 为titleLable的高度 6为titleLabel和timeLabel的间距  14.5 为下面的timeLabel的高度 12为底部默认留的间距
        self.getProp("timeLabel").setText(timeStr);

    },
    handleTimetemp_index:function(last_time,new_ep_index){
        var temp = last_time.integerValue();
        var dateFormatter = NSDateFormatter.alloc().init();
        dateFormatter.setDateFormat("yyyy-MM-dd HH:mm:ss.s");
       var date = NSDate.dateWithTimeIntervalSince1970(temp);
        if (!date) {
            return "";
        }
        var weekDayString = NSArray.arrayWithObjects("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六",null);
        var keyOfDayFormater = NSDateFormatter.alloc().init();
        keyOfDayFormater.setDateFormat("yyyy-MM-dd");
        var secondsPerDay = 24 * 60 * 60;
        var todayDate = NSDate.date();
        var yesterdayDate = todayDate.dateByAddingTimeInterval(0 - secondsPerDay);
        //
        var unitFlags = 1 << 2 | 1 << 3 | 1 << 4 | 1 << 5 | 1 << 6 | 1 << 7|1 << 9;
        //
        var canlendar = NSCalendar.currentCalendar();
        var listOfdayComponents = canlendar.components_fromDate(unitFlags,date);
        //

        var hour = listOfdayComponents.hour()<10?"0":"";
        var minute = listOfdayComponents.minute()<10?"0":"";
        var rets = NSMutableString.string();
        //

        if (keyOfDayFormater.stringFromDate(date).isEqualToString(keyOfDayFormater.stringFromDate(todayDate))) {
            if (listOfdayComponents.hour()<6) {
                rets.appendString("凌晨");
            }else if (listOfdayComponents.hour()<12) {
                rets.appendString("上午");
            }else if (listOfdayComponents.hour()<14) {
                rets.appendString("中午");
            }else if (listOfdayComponents.hour()<18) {
                rets.appendString("下午");
            }else{
                rets.appendString("晚上");
            }
        } else if (keyOfDayFormater.stringFromDate(date).isEqualToString(keyOfDayFormater.stringFromDate(yesterdayDate))) {
            rets.appendString("昨天");
        } else {
            rets.appendString(weekDayString.objectAtIndex(listOfdayComponents.weekday()-1));
        }
        //[rets appendString:[NSString stringWithFormat:@"%@%zd:%@%zd",hour,listOfdayComponents.hour,minute,listOfdayComponents.minute]];
        var jsStr =  hour + listOfdayComponents.hour() +":"+ minute + listOfdayComponents.minute() +" · " + "第 " + new_ep_index.toJS() + " 话";
        rets.appendString(jsStr);
        return rets;

    },
    layoutSubviews:function(){
        self.super().layoutSubviews();
        var margin = 12;
        var totalWidth = UIScreen.mainScreen().bounds().width;
        var width = (totalWidth - (3 * margin))/2;
        var coverImageScale = 108/174;
        var coverImageHeight = width * coverImageScale;
        self.getProp("coverImage").setFrame({x:0, y:0, width:width, height:coverImageHeight});
        //x减掉80而不是85的原因是想让图片出去一点
        self.getProp("watchBGimageView").setFrame({x:width - 80, y:6, width:85, height:85/3.14});
        self.getProp("watchCountLabel").setFrame(self.getProp("watchBGimageView").bounds());
        self.getProp("titleLabel").setFrame({x:0, y:coverImageHeight + 6, width:width, height:17});
        //coverImage为封面图片高度， 17 为titleLable的高度 6为titleLabel和timeLabel的间距  14.5 为下面的timeLabel的高度 12为底部默认留的间距
        self.getProp("timeLabel").setFrame({x:0, y:coverImageHeight + 6 + 17 + 12, width:width, height:14.5});
    }

})
//SW 首页番剧中的完结动画cell SWHomeBangumiDidEndCell (有可以滚动的item) 完结动画
defineClass("SWHomeBangumiDidEndCell:UITableViewCell",{

})
// SW 首页番剧中的完结动画cell中的item  完结动画item
defineClass("SWHomeBangumiDidEndItem:UIView",{

})

// SW 首页番剧中带有一个封面banner 一个title 一个content(其中有一个cell头部带有番剧推荐字样，我想通过继承关系子类通过条件去掉该番剧推荐字样)  番剧推荐
defineClass("SWHomeBangumiRecommendCell:UITableViewCell",{

})

//SW 首页二级页面 的控制器---------------------------//SW 首页二级页面 的控制器---------------------------//SW 首页二级页面 的控制器---------------------------//SW 首页二级页面 的控制器---------------------------

defineClass("SWHomeSecondViewController:SWHomeViewController",{
    lazyImageView:function(){
        var imageView = UIImageView.alloc().initWithFrame({x:0, y:0, width:375, height:UIScreen.mainScreen().bounds().height });
        imageView.setUserInteractionEnabled(1);
        var tap = require('UITapGestureRecognizer').alloc().initWithTarget_action(self,'tapClick:');
        imageView.addGestureRecognizer(tap);
        imageView.setContentMode(1);
        imageView.setBackgroundColor(UIColor.blackColor());
        return imageView;
    }
})

defineClass("SWHomeSecondViewController: SWHomeViewController<UITableViewDelegate>", {
    tableView_didSelectRowAtIndexPath: function (tableView, indexPath) {
        tableView.deselectRowAtIndexPath_animated(indexPath,1);
        var dict = self.getProp("data").objectAtIndex(indexPath.row());
        var urlStr = dict.objectForKey('face');
        var url = NSURL.URLWithString(urlStr);
        var imageView = self.lazyImageView();
        imageView.sd__setImageWithURL(url);
        self.view().addSubview(imageView);
  
    }
})


//SW分区----------------------//SW分区----------------------//SW分区----------------------//SW分区----------------------//SW分区----------------------//SW分区----------------------//SW分区----------

defineClass("SWCategoryController: SWHomeViewController",{
    init:function(){
        if(self.ORIGinit()){
            var normalImage = UIImage.imageNamed("home_category_tab");
            var selectImage = UIImage.imageNamed("home_category_tab_s");
            normalImage = normalImage.imageWithRenderingMode(1);
            selectImage = selectImage.imageWithRenderingMode(1);
            self.tabBarItem().setImage(normalImage);
            self.tabBarItem().setSelectedImage(selectImage);

            self.setProp_forKey("http://bangumi.bilibili.com/sponsor/rank/get_sponsor_total?access_key=5e0df12c70fcf9a5b20a2a8dcb956ca1&actionKey=appkey&appkey=27eb53fc9058f8c3&build=3445&device=phone&mobi_app=iphone&page=1&pagesize=100&platform=ios&season_id=5027&sign=6dfbe4193ec84aed0ef3e38d1f810ec4&ts=1468406428",'urlStr');

        }
        return self;
    }

})

// SW 关注-------------------------// SW 关注-------------------------// SW 关注-------------------------// SW 关注-------------------------// SW 关注-------------------------// SW 关注-------------------------

defineClass("SWConcernViewController: SWHomeViewController",{
    init:function(){
        if(self.ORIGinit()){
            var normalImage = UIImage.imageNamed("home_attention_tab");
            var selectImage = UIImage.imageNamed("home_attention_tab_s");
            normalImage = normalImage.imageWithRenderingMode(1);
            selectImage = selectImage.imageWithRenderingMode(1);
            self.tabBarItem().setImage(normalImage);
            self.tabBarItem().setSelectedImage(selectImage);

            self.setProp_forKey("http://bangumi.bilibili.com/sponsor/rank/get_sponsor_total?access_key=5e0df12c70fcf9a5b20a2a8dcb956ca1&actionKey=appkey&appkey=27eb53fc9058f8c3&build=3445&device=phone&mobi_app=iphone&page=1&pagesize=100&platform=ios&season_id=5027&sign=6dfbe4193ec84aed0ef3e38d1f810ec4&ts=1468406428",'urlStr');

        }
        return self;
    }

})


// SW 发现-------------------------// SW 发现-------------------------// SW 发现-------------------------// SW 发现-------------------------// SW 发现-------------------------// SW 发现-------------------------

defineClass("SWSearchViewController: SWHomeViewController",{
    init:function(){
        if(self.ORIGinit()){
            var normalImage = UIImage.imageNamed("home_discovery_tab");
            var selectImage = UIImage.imageNamed("home_discovery_tab_s");
            normalImage = normalImage.imageWithRenderingMode(1);
            selectImage = selectImage.imageWithRenderingMode(1);
            self.tabBarItem().setImage(normalImage);
            self.tabBarItem().setSelectedImage(selectImage);

            self.setProp_forKey("http://bangumi.bilibili.com/sponsor/rank/get_sponsor_total?access_key=5e0df12c70fcf9a5b20a2a8dcb956ca1&actionKey=appkey&appkey=27eb53fc9058f8c3&build=3445&device=phone&mobi_app=iphone&page=1&pagesize=100&platform=ios&season_id=5027&sign=6dfbe4193ec84aed0ef3e38d1f810ec4&ts=1468406428",'urlStr');

        }
        return self;
    }

})



// SW 我的-------------------------// SW 我的-------------------------// SW 我的-------------------------// SW 我的-------------------------// SW 我的-------------------------// SW 我的-------------------------
defineClass("SWPlayerUserCenterViewController: SWHomeViewController",{
    init:function(){
        if(self.ORIGinit()){
            var normalImage = UIImage.imageNamed("home_mine_tab");
            var selectImage = UIImage.imageNamed("home_mine_tab_s");
            normalImage = normalImage.imageWithRenderingMode(1);
            selectImage = selectImage.imageWithRenderingMode(1);
            self.tabBarItem().setImage(normalImage);
            self.tabBarItem().setSelectedImage(selectImage);

            self.setProp_forKey("http://bangumi.bilibili.com/sponsor/rank/get_sponsor_total?access_key=5e0df12c70fcf9a5b20a2a8dcb956ca1&actionKey=appkey&appkey=27eb53fc9058f8c3&build=3445&device=phone&mobi_app=iphone&page=1&pagesize=100&platform=ios&season_id=5027&sign=6dfbe4193ec84aed0ef3e38d1f810ec4&ts=1468406428",'urlStr');

        }
        return self;
    }

})



//public element 自己手动封装一些公共控件--------------------------------------//public element 自己手动封装一些公共控件--------------------------------------//public element 自己手动封装一些公共控件--------------------------------------
defineClass("SWContainerView:UIView<UIScrollViewDelegate>",{
    init:function(){
        if(self.ORIGinit()){
            //初始化子控件
            var scrollView = UIScrollView.alloc().init();
            scrollView.setShowsVerticalScrollIndicator(0);
            scrollView.setShowsHorizontalScrollIndicator(0);
            scrollView.setPagingEnabled(1);
            scrollView.setBounces(0);
            scrollView.setDelegate(self);
            scrollView.setScrollsToTop(0);
            scrollView.setBackgroundColor(UIColor.redColor());
            self.setProp_forKey(scrollView,"scrollView");
            self.addSubview(scrollView);

            var topBar = SWTopBar.alloc().init();
            topBar.setProp_forKey(self,"delegate");
            topBar.setBackgroundColor(mainColor);
            self.setProp_forKey(topBar,"topBar");
            self.addSubview(topBar);
            self.setUserInteractionEnabled(1);
            self.setProp_forKey(64,"topBarHeight");

        }
        return self;
    },
    //topBarDelegate
    changeContentOffset:function(tag){
        var scrollView = self.getProp("scrollView");
        var rect = scrollView.bounds();
        var scrollViewWidth = rect.width;
        UIView.animateWithDuration_animations(0.25,block("",function(){
            scrollView.setContentOffset({x:tag*scrollViewWidth, y:0});
        }));
    },
    //scrollView delegate
    scrollViewDidEndDecelerating:function(scrollView){
        var rect = scrollView.bounds();
        var width = rect.width;
       var selectIndex = scrollView.contentOffset().x/width;
        self.getProp("topBar").changeSelectIndex(selectIndex);
    },
    scrollViewDidScroll:function(scrollView){
        self.getProp("topBar").slowChangeIndicatorViewFrame(scrollView.contentOffset().x/scrollView.frame().width);
    },
    installViewControllers:function(array){
      self.setProp_forKey(array,"vcArray");
         var scrollView = self.getProp("scrollView");
        var titles = NSMutableArray.alloc().init();
        var count = array.count();
        for(var i = 0;i<count; i++){
            var vc = array.objectAtIndex(i);
            var title = vc.title();
            titles.addObject(title);
            scrollView.addSubview(vc.view());
        }
        self.getProp("topBar").installTitles(titles);

    },
    layoutSubviews:function(){
        self.super().layoutSubviews();
        var topBarHeight = self.getProp("topBarHeight");
        var rect = self.bounds();
        var viewWidth = rect.width;
        var viewHeight = rect.height;
        var scrollView = self.getProp("scrollView");
        self.getProp("topBar").setFrame({x:0, y:0, width:viewWidth, height:topBarHeight});
        scrollView.setFrame({x:0, y:topBarHeight, width:viewWidth, height:viewHeight - topBarHeight - 44});
        var vcs = self.getProp("vcArray");
        var count = vcs.count();
        if(count > 0){
            for(var i = 0;i<count; i++){
                var vc = vcs.objectAtIndex(i);
                vc.view().setFrame({x:i*viewWidth, y:0, width:viewWidth, height:viewHeight - topBarHeight});
            }

        }
        scrollView.setContentSize({width:viewWidth*count,height:viewHeight - topBarHeight - 44});
    }

})

// 封装的container的子控件topBar
defineClass("SWTopBar:UIView",{
    init:function(){
      if(self.ORIGinit()){
      }
        return self;
    },
    installTitles:function(titleArray){
        var count = titleArray.count();
        if(count <= 0){
            return;
        }
        self.setProp_forKey(titleArray,'titleArray');
        for(var i = 0; i<count; i++){
            var title = titleArray.objectAtIndex(i);
            var titleLabel = UILabel.alloc().init();
            titleLabel.setTextAlignment(1);
            titleLabel.setTextColor(UIColor.whiteColor());
            titleLabel.setText(title);
            titleLabel.setTag(i);
            titleLabel.setUserInteractionEnabled(1);
            var tap = UITapGestureRecognizer.alloc().initWithTarget_action(self,"tapClick:");
            titleLabel.addGestureRecognizer(tap);
            self.addSubview(titleLabel);
        }
        var indicatorView = UIView.alloc().init();
        self.addSubview(indicatorView);
        indicatorView.setBackgroundColor(UIColor.whiteColor());
        self.setProp_forKey(indicatorView,"indicatorView");
    },
    changeSelectIndex:function(selectIndex){
        var subviewsArray = self.subviews();
        if(selectIndex < subviewsArray.count()){
            var indicatorView = self.getProp("indicatorView");
            var label = subviewsArray.objectAtIndex(selectIndex);
            var labelX = label.frame().x;
            var rect = self.bounds();
            var viewWidth = rect.width;
            var viewHeight = rect.height;
            var count = self.subviews().count();
            var temWidth = (viewWidth - 100) / (count - 1);
            //下面的 加x上面10 和width-20是因为indicatorView宽度太宽
            UIView.animateWithDuration_animations(0.25,block("",function(){
                indicatorView.setFrame({x:labelX + 10, y:viewHeight - 3, width:temWidth - 20, height:2});
            }));

        }
    },
    slowChangeIndicatorViewFrame:function(scaleProgress){
        if(scaleProgress!=scaleProgress){
            return;
        }
    },
    tapClick:function(tap){
        var tag = tap.view().tag();
        var rect = self.bounds();
        var viewWidth = rect.width;
        var labelX = tap.view().frame().x;
        var count = self.subviews().count();
        var viewHeight = rect.height;
        var temWidth = (viewWidth - 100) / (count - 1);
        UIView.animateWithDuration_animations(0.25,block("",function(){
            self.getProp("indicatorView").setFrame({x:labelX + 10, y:viewHeight - 3, width:temWidth - 20, height:2});
        }));

        self.getProp("delegate").changeContentOffset(tag);

    },
    layoutSubviews:function() {
        self.super().layoutSubviews();
        var rect = self.bounds();
        var viewWidth = rect.width;
        var viewHeight = rect.height;
        var count = self.subviews().count();
        var titleArray = self.getProp("titleArray");
        var titleLabelArray = self.subviews();
        var temWidth = (viewWidth - 100) / (count - 1);
        if (count > 0) {
            for (var i = 0; i < count; i++) {
                var titleLabel = titleLabelArray.objectAtIndex(i);
                titleLabel.setFrame({x: 50 + temWidth * i, y: 10, width: temWidth, height: viewHeight});
                if(i ==count - 1){
                titleLabel.setFrame({x:60, y:viewHeight - 3, width:temWidth - 20, height:2});
                };
            }
        }
    }
})

// 不允许悬浮的tableView
defineClass("SWTableView:UITableView",{
  allowsHeaderViewsToFloat:function(){
      return 0;
  }
})

//可以垂直居中的label
defineClass("SWLabel:UILabel",{
    installVerticalAlignment:function(verticalAlignment) {
        self.setProp_forKey(verticalAlignment,"verticalAlignment");
        self.setNeedsDisplay();
},
    textRectForBounds_limitedToNumberOfLines:function(bounds,numberOfLines){
    var textRect = self.super().textRectForBounds_limitedToNumberOfLines(bounds,numberOfLines);
        //101 为垂直顶部对齐
        if(self.getProp("verticalAlignment") == 101){
            textRect.y = bounds.y;
            return textRect;
        }

        //102 为垂直底部对齐
        if(self.getProp("verticalAlignment") == 102){
            textRect.y = bounds.y + bounds.height - textRect.height;
            return textRect;
        }
        //103 为垂直居中对齐 这里直接设置居中为默认
        if(self.getProp("verticalAlignment") == 103){
            //下面这个加 1 是临时加上去的 是脏代码。
            textRect.y = bounds.y +(bounds.height - textRect.height)/2.0 - 1;
            return textRect;

        }
        return textRect;

},
    drawTextInRect:function(requestedRect) {
    var actualRect = self.textRectForBounds_limitedToNumberOfLines(requestedRect,self.getProp("numberOfLines"));
    self.super().drawTextInRect(actualRect);
}
})