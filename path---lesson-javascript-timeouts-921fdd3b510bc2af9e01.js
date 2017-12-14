webpackJsonp([0x4d3a8420d05d1800],{"./node_modules/json-loader/index.js!./.cache/json/lesson-javascript-timeouts.json":function(s,t){s.exports={data:{allPostTitles:{edges:[{node:{frontmatter:{title:"Getting Started",lesson:2,category:"javascript",chapter:1,type:"lesson"},fields:{slug:"/getting-started"}}},{node:{frontmatter:{title:"Persist",lesson:1,category:"javascript",chapter:3,type:"lesson"},fields:{slug:"/persist"}}},{node:{frontmatter:{title:"Actor Communication",lesson:2,category:"javascript",chapter:2,type:"lesson"},fields:{slug:"/actor-communication"}}},{node:{frontmatter:{title:"Hierarchy",lesson:4,category:"javascript",chapter:2,type:"lesson"},fields:{slug:"/hierarchy"}}},{node:{frontmatter:{title:"Snapshotting",lesson:2,category:"javascript",chapter:3,type:"lesson"},fields:{slug:"/snapshotting"}}},{node:{frontmatter:{title:"Timeouts",lesson:3,category:"javascript",chapter:3,type:"lesson"},fields:{slug:"/timeouts"}}},{node:{frontmatter:{title:"Stateful Actors",lesson:1,category:"javascript",chapter:2,type:"lesson"},fields:{slug:"/stateful-actors"}}},{node:{frontmatter:{title:"Querying",lesson:3,category:"javascript",chapter:2,type:"lesson"},fields:{slug:"/querying"}}},{node:{frontmatter:{title:"Introduction",lesson:1,category:"javascript",chapter:1,type:"lesson"},fields:{slug:"/introduction"}}}]},postBySlug:{html:'<p>While not strictly a part of the persistent actor, timeouts are frequently used with snapshotting. Actors take up memory, which is still a limited resource. If an actor has not processed messages in a while, it makes sense to shut it down until it is again needed; this frees up memory. Adding a timeout to the user contacts service is similar to snapshotting:</p>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code><span class="token keyword">const</span> <span class="token punctuation">{</span> messages<span class="token punctuation">,</span> minutes <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'nact\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> spawnUserContactService <span class="token operator">=</span> <span class="token punctuation">(</span>parent<span class="token punctuation">,</span> userId<span class="token punctuation">)</span> <span class="token operator">=</span><span class="token operator">></span> <span class="token function">spawnPersistent</span><span class="token punctuation">(</span>\n  parent<span class="token punctuation">,</span>\n  <span class="token comment" spellcheck="true">// Same function as before</span>\n  <span class="token keyword">async</span> <span class="token punctuation">(</span>state <span class="token operator">=</span> <span class="token punctuation">{</span> contacts<span class="token punctuation">:</span><span class="token punctuation">{</span><span class="token punctuation">}</span> <span class="token punctuation">}</span><span class="token punctuation">,</span> msg<span class="token punctuation">,</span> ctx<span class="token punctuation">)</span> <span class="token operator">=</span><span class="token operator">></span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token template-string"><span class="token string">`contacts:</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>userId<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">`</span></span><span class="token punctuation">,</span>\n  userId<span class="token punctuation">,</span>\n  <span class="token punctuation">{</span> snapshotEvery<span class="token punctuation">:</span> <span class="token number">20</span> <span class="token operator">*</span> messages<span class="token punctuation">,</span>\n    shutdownAfter<span class="token punctuation">:</span> <span class="token number">10</span> <span class="token operator">*</span> minutes\n  <span class="token punctuation">}</span>\n<span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>In the code above, the user contacts service stops if it hasn\'t received a new message in 10 minutes. </p>',timeToRead:1,excerpt:"While not strictly a part of the persistent actor, timeouts are frequently used with snapshotting. Actors take up memory, which is still a...",frontmatter:{title:"Timeouts",cover:"https://unsplash.it/400/300/?random?BoldMage",date:"11/12/2017",category:"javascript",tags:["getting-started","nact","javascript","nodejs"]},fields:{slug:"/timeouts"}}},pathContext:{slug:"/timeouts",category:"javascript"}}}});
//# sourceMappingURL=path---lesson-javascript-timeouts-921fdd3b510bc2af9e01.js.map