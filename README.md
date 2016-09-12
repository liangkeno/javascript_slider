##使用javascirpt记录一次幻灯片的实现过程##

html结构如下：
<pre>
<p>&lt;div class=&quot;container&quot;&gt;
	&lt;div class=&quot;slider&quot;&gt;
		&lt;ul class=&quot;slider_inr&quot; style=&quot;left:0;&quot;&gt;
			&lt;li&gt;&lt;a href=&quot;#&quot;&gt;&lt;img src=&quot;./src/images/imgs1.jpg&quot;&gt;&lt;/a&gt;&lt;/li&gt;
			&lt;li&gt;&lt;a href=&quot;#&quot;&gt;&lt;img src=&quot;./src/images/imgs1.jpg&quot;&gt;&lt;/a&gt;&lt;/li&gt;
			&lt;li&gt;&lt;a href=&quot;#&quot;&gt;&lt;img src=&quot;./src/images/imgs1.jpg&quot;&gt;&lt;/a&gt;&lt;/li&gt;
			&lt;li&gt;&lt;a href=&quot;#&quot;&gt;&lt;img src=&quot;./src/images/imgs1.jpg&quot;&gt;&lt;/a&gt;&lt;/li&gt;
		&lt;/ul&gt;
	&lt;/div&gt;
&lt;/div&gt;</p>
</pre>

javascrpt 实现：

把幻灯片实现分成三个模块
> 1. 视图的初始化模块 **initHtml** ，主要对视图的宽高，控制标签，nav page的初始化
> 2. 动画的模块，**animate**，主要处理滚动一张幻灯片的动画，自动滚动，暂停动画，调节索引控制动画
> 3. 事件控制模块，**eventControl**，处理事件的绑定，给鼠标进入区域离开区域，及单击事件绑定事件控制

