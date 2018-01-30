webpackJsonp([37599133158065],{395:function(n,s){n.exports={data:{allPostTitles:{edges:[{node:{frontmatter:{title:"Adapters",lesson:6,category:"reasonml",chapter:2,type:"lesson"},fields:{slug:"/adapters"}}},{node:{frontmatter:{title:"Decoders and Encoders",lesson:2,category:"reasonml",chapter:4,type:"lesson"},fields:{slug:"/decoders-and-encoders"}}},{node:{frontmatter:{title:"Actor Communication",lesson:2,category:"reasonml",chapter:2,type:"lesson"},fields:{slug:"/actor-communication"}}},{node:{frontmatter:{title:"Getting Started",lesson:2,category:"reasonml",chapter:1,type:"lesson"},fields:{slug:"/getting-started"}}},{node:{frontmatter:{title:"Logging and Monitoring",lesson:1,category:"reasonml",chapter:4,type:"lesson"},fields:{slug:"/logging-and-monitoring"}}},{node:{frontmatter:{title:"Introduction",lesson:1,category:"reasonml",chapter:1,type:"lesson"},fields:{slug:"/introduction"}}},{node:{frontmatter:{title:"Persist",lesson:1,category:"reasonml",chapter:3,type:"lesson"},fields:{slug:"/persist"}}},{node:{frontmatter:{title:"Hierarchy",lesson:4,category:"reasonml",chapter:2,type:"lesson"},fields:{slug:"/hierarchy"}}},{node:{frontmatter:{title:"Querying",lesson:3,category:"reasonml",chapter:2,type:"lesson"},fields:{slug:"/querying"}}},{node:{frontmatter:{title:"Snapshotting",lesson:2,category:"reasonml",chapter:3,type:"lesson"},fields:{slug:"/snapshotting"}}},{node:{frontmatter:{title:"Stateful Actors",lesson:1,category:"reasonml",chapter:2,type:"lesson"},fields:{slug:"/stateful-actors"}}},{node:{frontmatter:{title:"Supervision",lesson:5,category:"reasonml",chapter:2,type:"lesson"},fields:{slug:"/supervision"}}},{node:{frontmatter:{title:"Timeouts",lesson:3,category:"reasonml",chapter:3,type:"lesson"},fields:{slug:"/timeouts"}}}]},postBySlug:{html:'<p>Production system need to be watched like hawks. Knowing that your service has spontaneously burst into flames and having at least some idea why is the first step in fixing an error in production. There are some excellent logging frameworks in node, but they don\'t make accommodations for the actor model. Nact includes logging which automatically captures a reference to the actor\'s context. </p>\n<p>Here is an example of an actor which classifies whether strings are <em>bad</em> or <em>good</em> (bad defined as anything containing the substring \'mutation\') and logs the bad strings as events and the good strings as info messages:</p>\n<div class="gatsby-highlight">\n      <pre class="language-reason"><code><span class="token keyword">open</span> <span class="token constructor variable">Nact</span><span class="token punctuation">;</span>\n<span class="token keyword">open</span> <span class="token class-name">Nact</span><span class="token punctuation">.</span><span class="token constructor variable">Operators</span><span class="token punctuation">;</span>\n\n<span class="token keyword">open</span> <span class="token class-name">Js</span><span class="token punctuation">.</span><span class="token constructor variable">Promise</span><span class="token punctuation">;</span>\n\n<span class="token keyword">let</span> system <span class="token operator">=</span> start<span class="token punctuation">(</span><span class="token operator">~</span>logger<span class="token operator">=</span><span class="token comment" spellcheck="true">/* will discuss how to define a logger in the next section */</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword">let</span> stringClassifierActor <span class="token operator">=</span>\n  spawnStateless<span class="token punctuation">(</span>\n    <span class="token operator">~</span>name<span class="token operator">=</span><span class="token string">"classifier"</span><span class="token punctuation">,</span>\n    system<span class="token punctuation">,</span>\n    <span class="token punctuation">(</span>msg<span class="token punctuation">,</span> ctx<span class="token punctuation">)</span> <span class="token operator">=></span>\n      resolve\n        <span class="token comment" spellcheck="true">/* strings containing mutation are evil.  */</span>\n        <span class="token punctuation">(</span>\n          <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token class-name">Js</span><span class="token punctuation">.</span><span class="token class-name">String</span><span class="token punctuation">.</span>indexOf<span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">.</span>lowercase<span class="token punctuation">(</span>msg<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token string">"mutation"</span><span class="token punctuation">)</span> <span class="token operator">>=</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            ctx<span class="token punctuation">.</span>logger <span class="token operator">|</span><span class="token operator">></span> <span class="token class-name">Log</span><span class="token punctuation">.</span>event<span class="token punctuation">(</span><span class="token operator">~</span>name<span class="token operator">=</span><span class="token string">"receivedEvilMessage"</span><span class="token punctuation">,</span> <span class="token operator">~</span>properties<span class="token operator">=</span>msg<span class="token punctuation">)</span>\n          <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>\n            ctx<span class="token punctuation">.</span>logger <span class="token operator">|</span><span class="token operator">></span> <span class="token class-name">Log</span><span class="token punctuation">.</span>info<span class="token punctuation">(</span><span class="token string">"Received message: "</span> <span class="token operator">+</span><span class="token operator">+</span> msg<span class="token punctuation">)</span>\n          <span class="token punctuation">}</span>\n        <span class="token punctuation">)</span>\n  <span class="token punctuation">)</span><span class="token punctuation">;</span>\n  \nstringClassifierActor <span class="token operator">&lt;</span><span class="token operator">-</span><span class="token operator">&lt;</span> <span class="token string">"hello"</span><span class="token punctuation">;</span>\nstringClassifierActor <span class="token operator">&lt;</span><span class="token operator">-</span><span class="token operator">&lt;</span> <span class="token string">"mutation"</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>To make this example usable, we\'ll need to define a logger. A logger is simply an actor which accepts messages of type Log.t. Since the logger is defined before the system has started, the signature of the ~logger argument is (actorRef(systemMsg) => actorRef(Log.t), implying that the logger takes in a reference to the system and returns a reference to another actor which accepts log messages. </p>\n<p>The logger below writes the messages it receives to the console:</p>\n<div class="gatsby-highlight">\n      <pre class="language-reason"><code><span class="token keyword">let</span> defaultTo <span class="token operator">=</span> <span class="token punctuation">(</span>default<span class="token punctuation">)</span> <span class="token operator">=></span>\n  <span class="token keyword">fun</span>\n  <span class="token operator">|</span> <span class="token constructor variable">Some</span><span class="token punctuation">(</span>v<span class="token punctuation">)</span> <span class="token operator">=></span> v\n  <span class="token operator">|</span> <span class="token constructor variable">None</span> <span class="token operator">=></span> default<span class="token punctuation">;</span>\n\n<span class="token keyword">let</span> getLogText <span class="token operator">=</span>\n  <span class="token keyword">fun</span>\n  <span class="token operator">|</span> <span class="token constructor variable">Message</span><span class="token punctuation">(</span>level<span class="token punctuation">,</span> text<span class="token punctuation">,</span> date<span class="token punctuation">,</span> actor<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n      <span class="token keyword">let</span> pathStr <span class="token operator">=</span> <span class="token class-name">Nact</span><span class="token punctuation">.</span><span class="token class-name">ActorPath</span><span class="token punctuation">.</span>toString<span class="token punctuation">(</span>actor<span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token keyword">let</span> dateStr <span class="token operator">=</span> <span class="token class-name">Js</span><span class="token punctuation">.</span><span class="token class-name">Date</span><span class="token punctuation">.</span>toUTCString<span class="token punctuation">(</span>date<span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token keyword">let</span> levelStr <span class="token operator">=</span> logLevelToString<span class="token punctuation">(</span>level<span class="token punctuation">)</span> <span class="token operator">|</span><span class="token operator">></span> <span class="token class-name">String</span><span class="token punctuation">.</span>uppercase<span class="token punctuation">;</span>\n      <span class="token punctuation">(</span>levelStr<span class="token punctuation">,</span> pathStr<span class="token punctuation">,</span> dateStr<span class="token punctuation">,</span> text<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token operator">|</span> <span class="token constructor variable">Error</span><span class="token punctuation">(</span>err<span class="token punctuation">,</span> date<span class="token punctuation">,</span> actor<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n      <span class="token keyword">let</span> pathStr <span class="token operator">=</span> <span class="token class-name">Nact</span><span class="token punctuation">.</span><span class="token class-name">ActorPath</span><span class="token punctuation">.</span>toString<span class="token punctuation">(</span>actor<span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token keyword">let</span> dateStr <span class="token operator">=</span> <span class="token class-name">Js</span><span class="token punctuation">.</span><span class="token class-name">Date</span><span class="token punctuation">.</span>toUTCString<span class="token punctuation">(</span>date<span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token keyword">let</span> json <span class="token operator">=</span> <span class="token class-name">Js</span><span class="token punctuation">.</span><span class="token class-name">Json</span><span class="token punctuation">.</span>stringifyAny<span class="token punctuation">(</span>err<span class="token punctuation">)</span> <span class="token operator">|</span><span class="token operator">></span> defaultTo<span class="token punctuation">(</span><span class="token string">""</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token punctuation">(</span><span class="token string">"EXCEPTION"</span><span class="token punctuation">,</span> pathStr<span class="token punctuation">,</span> dateStr<span class="token punctuation">,</span> json<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token operator">|</span> <span class="token constructor variable">Metric</span><span class="token punctuation">(</span>name<span class="token punctuation">,</span> data<span class="token punctuation">,</span> date<span class="token punctuation">,</span> actor<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n      <span class="token keyword">let</span> pathStr <span class="token operator">=</span> <span class="token class-name">Nact</span><span class="token punctuation">.</span><span class="token class-name">ActorPath</span><span class="token punctuation">.</span>toString<span class="token punctuation">(</span>actor<span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token keyword">let</span> dateStr <span class="token operator">=</span> <span class="token class-name">Js</span><span class="token punctuation">.</span><span class="token class-name">Date</span><span class="token punctuation">.</span>toUTCString<span class="token punctuation">(</span>date<span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token keyword">let</span> json <span class="token operator">=</span> <span class="token class-name">Js</span><span class="token punctuation">.</span><span class="token class-name">Json</span><span class="token punctuation">.</span>stringify<span class="token punctuation">(</span>data<span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token punctuation">(</span><span class="token string">"METRIC"</span><span class="token punctuation">,</span> pathStr<span class="token punctuation">,</span> dateStr<span class="token punctuation">,</span> <span class="token punctuation">{</span>j<span class="token operator">|</span><span class="token punctuation">{</span> <span class="token string">"$name"</span><span class="token punctuation">:</span> $json <span class="token punctuation">}</span><span class="token operator">|</span>j<span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token operator">|</span> <span class="token constructor variable">Event</span><span class="token punctuation">(</span>name<span class="token punctuation">,</span> data<span class="token punctuation">,</span> date<span class="token punctuation">,</span> actor<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n      <span class="token keyword">let</span> pathStr <span class="token operator">=</span> <span class="token class-name">Nact</span><span class="token punctuation">.</span><span class="token class-name">ActorPath</span><span class="token punctuation">.</span>toString<span class="token punctuation">(</span>actor<span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token keyword">let</span> dateStr <span class="token operator">=</span> <span class="token class-name">Js</span><span class="token punctuation">.</span><span class="token class-name">Date</span><span class="token punctuation">.</span>toUTCString<span class="token punctuation">(</span>date<span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token keyword">let</span> json <span class="token operator">=</span> <span class="token class-name">Js</span><span class="token punctuation">.</span><span class="token class-name">Json</span><span class="token punctuation">.</span>stringify<span class="token punctuation">(</span>data<span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token punctuation">(</span><span class="token string">"EVENT"</span><span class="token punctuation">,</span> pathStr<span class="token punctuation">,</span> dateStr<span class="token punctuation">,</span> <span class="token punctuation">{</span>j<span class="token operator">|</span><span class="token punctuation">{</span> <span class="token string">"$name"</span><span class="token punctuation">:</span> $json <span class="token punctuation">}</span><span class="token operator">|</span>j<span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token operator">|</span> <span class="token constructor variable">Unknown</span><span class="token punctuation">(</span>payload<span class="token punctuation">,</span> date<span class="token punctuation">,</span> actor<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n      <span class="token keyword">let</span> pathStr <span class="token operator">=</span> <span class="token class-name">Nact</span><span class="token punctuation">.</span><span class="token class-name">ActorPath</span><span class="token punctuation">.</span>toString<span class="token punctuation">(</span>actor<span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token keyword">let</span> dateStr <span class="token operator">=</span> <span class="token class-name">Js</span><span class="token punctuation">.</span><span class="token class-name">Date</span><span class="token punctuation">.</span>toUTCString<span class="token punctuation">(</span>date<span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token keyword">let</span> text <span class="token operator">=</span> <span class="token class-name">Js</span><span class="token punctuation">.</span><span class="token class-name">Json</span><span class="token punctuation">.</span>stringify<span class="token punctuation">(</span>payload<span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token punctuation">(</span><span class="token string">"???"</span><span class="token punctuation">,</span> pathStr<span class="token punctuation">,</span> dateStr<span class="token punctuation">,</span> text<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n<span class="token keyword">let</span> consoleLogger <span class="token operator">=</span> <span class="token punctuation">(</span>system<span class="token punctuation">)</span> <span class="token operator">=></span>\n  spawnStateless<span class="token punctuation">(</span>\n    <span class="token operator">~</span>name<span class="token operator">=</span><span class="token string">"console-logger"</span><span class="token punctuation">,</span>\n    system<span class="token punctuation">,</span>\n    <span class="token punctuation">(</span>msg<span class="token punctuation">,</span> _<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n      <span class="token keyword">let</span> <span class="token punctuation">(</span>label<span class="token punctuation">,</span> path<span class="token punctuation">,</span> date<span class="token punctuation">,</span> body<span class="token punctuation">)</span> <span class="token operator">=</span> getLogText<span class="token punctuation">(</span>msg<span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token class-name">Js</span><span class="token punctuation">.</span>log<span class="token punctuation">(</span><span class="token punctuation">{</span>j<span class="token operator">|</span><span class="token punctuation">[</span>$label<span class="token punctuation">,</span> $path<span class="token punctuation">,</span> $date<span class="token punctuation">]</span><span class="token punctuation">:</span> $body<span class="token operator">|</span>j<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token class-name">Js</span><span class="token punctuation">.</span><span class="token class-name">Promise</span><span class="token punctuation">.</span>resolve<span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>we finally then need to tell nact to use this logger:</p>\n<div class="gatsby-highlight">\n      <pre class="language-reason"><code>  <span class="token keyword">let</span> system <span class="token operator">=</span> start<span class="token punctuation">(</span><span class="token operator">~</span>logger<span class="token operator">=</span>consoleLogger<span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>Note the different log variants:</p>\n<ul>\n<li>A <code>Message</code> is created when invoking <code>Log.info</code>/<code>Log.warn</code>, etc. </li>\n<li>An <code>Event</code> emerges when invoking <code>Log.event</code> and includes the event name and event properties in a JSON representation. </li>\n<li>A <code>Metric</code> is manufactured when calling <code>Log.metric</code>, and is a similar structure to <code>Event</code>.  </li>\n<li>An <code>Error</code> is extruded when calling <code>Log.exception_</code> and includes an value of type <code>exn</code> (the built in exception type)</li>\n<li><code>Unknown</code> is passed in to the logging actor when the logging middleware is unable to understand the structure of the log message. </li>\n</ul>\n<p>The design of the logging system has been kept relatively simple so as to allow users to wrap their own, preferred framework whilst remaining idiomatic to the actor model. </p>',timeToRead:3,excerpt:"Production system need to be watched like hawks. Knowing that your service has spontaneously burst into flames and having at least some idea...",frontmatter:{title:"Logging and Monitoring",cover:"https://unsplash.it/400/300/?random?BoldMage",date:"28/01/2018",category:"reasonml",tags:["getting-started","nact","reason","bucklescript"]},fields:{slug:"/logging-and-monitoring"}}},pathContext:{slug:"/logging-and-monitoring",category:"reasonml"}}}});
//# sourceMappingURL=path---lesson-reasonml-logging-and-monitoring-d996199ee015b90c96de.js.map