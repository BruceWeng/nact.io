webpackJsonp([34287489934870],{397:function(n,s){n.exports={data:{allPostTitles:{edges:[{node:{frontmatter:{title:"Adapters",lesson:6,category:"reasonml",chapter:2,type:"lesson"},fields:{slug:"/adapters"}}},{node:{frontmatter:{title:"Decoders and Encoders",lesson:2,category:"reasonml",chapter:4,type:"lesson"},fields:{slug:"/decoders-and-encoders"}}},{node:{frontmatter:{title:"Hierarchy",lesson:4,category:"reasonml",chapter:2,type:"lesson"},fields:{slug:"/hierarchy"}}},{node:{frontmatter:{title:"Actor Communication",lesson:2,category:"reasonml",chapter:2,type:"lesson"},fields:{slug:"/actor-communication"}}},{node:{frontmatter:{title:"Getting Started",lesson:2,category:"reasonml",chapter:1,type:"lesson"},fields:{slug:"/getting-started"}}},{node:{frontmatter:{title:"Persist",lesson:1,category:"reasonml",chapter:3,type:"lesson"},fields:{slug:"/persist"}}},{node:{frontmatter:{title:"Snapshotting",lesson:2,category:"reasonml",chapter:3,type:"lesson"},fields:{slug:"/snapshotting"}}},{node:{frontmatter:{title:"Introduction",lesson:1,category:"reasonml",chapter:1,type:"lesson"},fields:{slug:"/introduction"}}},{node:{frontmatter:{title:"Stateful Actors",lesson:1,category:"reasonml",chapter:2,type:"lesson"},fields:{slug:"/stateful-actors"}}},{node:{frontmatter:{title:"Querying",lesson:3,category:"reasonml",chapter:2,type:"lesson"},fields:{slug:"/querying"}}},{node:{frontmatter:{title:"Timeouts",lesson:3,category:"reasonml",chapter:3,type:"lesson"},fields:{slug:"/timeouts"}}},{node:{frontmatter:{title:"Supervision",lesson:5,category:"reasonml",chapter:2,type:"lesson"},fields:{slug:"/supervision"}}},{node:{frontmatter:{title:"Persistent Queries",lesson:4,category:"reasonml",chapter:3,type:"lesson"},fields:{slug:"/persistent-queries"}}}]},postBySlug:{html:'<p>Actor systems don\'t live in a vacuum, they need to be available to the outside world. Commonly actor systems are fronted by REST APIs or RPC frameworks. REST and RPC style access patterns are blocking: a request comes in, it is processed, and finally returned to the sender using the original connection. To help bridge nact\'s non blocking nature, Nact provides a <code>query</code> function. Query returns a promise.</p>\n<p>Similar to <code>dispatch</code>, <code>query</code> pushes a message on to an actor\'s mailbox, but differs in that it also creates a temporary actor. The temporary actor is passed into a function which returns the message to send to the target actor. When the temporary actor receives a message, the promise returned by the query resolves. </p>\n<p>In addition to the message, <code>query</code> also takes in a timeout value measured in milliseconds. If a query takes longer than this time to resolve, it times out and the promise is rejected. A time bounded query is very important in a production system; it ensures that a failing subsystem does not cause cascading faults as queries queue up and stress available system resources.</p>\n<p>In this example, we\'ll create a simple single user in-memory address book system.</p>\n<blockquote>\n<p>Note: We\'ll expand on this example in later sections.</p>\n</blockquote>\n<p>What are the basic requirements of a basic address book API? It should be able to:</p>\n<ul>\n<li>Create a new contact </li>\n<li>Fetch all contacts</li>\n<li>Fetch a specific contact</li>\n<li>Update an existing contact</li>\n<li>Delete a contact</li>\n</ul>\n<p>Because actor are message driven, let us define the message types used between the api and actor system:</p>\n<div class="gatsby-highlight">\n      <pre class="language-reason"><code><span class="token keyword">type</span> contactId <span class="token operator">=</span>\n  <span class="token operator">|</span> <span class="token constructor variable">ContactId</span><span class="token punctuation">(</span>int<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword">type</span> contact <span class="token operator">=</span> <span class="token punctuation">{</span>\n  name<span class="token punctuation">:</span> string<span class="token punctuation">,</span>\n  email<span class="token punctuation">:</span> string\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n<span class="token keyword">type</span> contactResponseMsg <span class="token operator">=</span>\n  <span class="token operator">|</span> <span class="token constructor variable">Success</span><span class="token punctuation">(</span>contact<span class="token punctuation">)</span>\n  <span class="token operator">|</span> <span class="token constructor variable">NotFound</span><span class="token punctuation">;</span>\n\n<span class="token keyword">type</span> contactMsg <span class="token operator">=</span>\n  <span class="token operator">|</span> <span class="token constructor variable">CreateContact</span><span class="token punctuation">(</span>contact<span class="token punctuation">)</span>\n  <span class="token operator">|</span> <span class="token constructor variable">RemoveContact</span><span class="token punctuation">(</span>contactId<span class="token punctuation">)</span>\n  <span class="token operator">|</span> <span class="token constructor variable">UpdateContact</span><span class="token punctuation">(</span>contactId<span class="token punctuation">,</span> contact<span class="token punctuation">)</span>\n  <span class="token operator">|</span> <span class="token constructor variable">FindContact</span><span class="token punctuation">(</span>contactId<span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>We also need to describe the shape of the contact actor\'s state. In this example, it was decided to create a <code>ContactIdMap</code> map to hold the list of contacts. <code>seqNumber</code> is used to assign each contact a unique identifier. <code>seqNumber</code> monotonically increases, even if a contact is deleted:</p>\n<div class="gatsby-highlight">\n      <pre class="language-reason"><code><span class="token keyword">module</span> <span class="token constructor variable">ContactIdCompare</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token keyword">type</span> t <span class="token operator">=</span> contactId<span class="token punctuation">;</span>\n  <span class="token keyword">let</span> compare <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token constructor variable">ContactId</span><span class="token punctuation">(</span>left<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token constructor variable">ContactId</span><span class="token punctuation">(</span>right<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">=></span> compare<span class="token punctuation">(</span>left<span class="token punctuation">,</span> right<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n<span class="token keyword">module</span> <span class="token constructor variable">ContactIdMap</span> <span class="token operator">=</span> <span class="token class-name">Map</span><span class="token punctuation">.</span><span class="token constructor variable">Make</span><span class="token punctuation">(</span><span class="token constructor variable">ContactIdCompare</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword">type</span> contactsServiceState <span class="token operator">=</span> <span class="token punctuation">{</span>\n  contacts<span class="token punctuation">:</span> <span class="token class-name">ContactIdMap</span><span class="token punctuation">.</span>t<span class="token punctuation">(</span>contact<span class="token punctuation">)</span><span class="token punctuation">,</span>\n  seqNumber<span class="token punctuation">:</span> int\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>Now let us create functions to handle each message type:</p>\n<div class="gatsby-highlight">\n      <pre class="language-reason"><code><span class="token keyword">let</span> createContact <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">{</span>contacts<span class="token punctuation">,</span> seqNumber<span class="token punctuation">}</span><span class="token punctuation">,</span> sender<span class="token punctuation">,</span> contact<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n  <span class="token keyword">let</span> contactId <span class="token operator">=</span> <span class="token constructor variable">ContactId</span><span class="token punctuation">(</span>seqNumber<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  sender <span class="token operator">&lt;</span><span class="token operator">-</span><span class="token operator">&lt;</span> <span class="token punctuation">(</span>contactId<span class="token punctuation">,</span> <span class="token constructor variable">Success</span><span class="token punctuation">(</span>contact<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token keyword">let</span> nextContacts <span class="token operator">=</span> <span class="token class-name">ContactIdMap</span><span class="token punctuation">.</span>add<span class="token punctuation">(</span>contactId<span class="token punctuation">,</span> contact<span class="token punctuation">,</span> contacts<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">{</span>contacts<span class="token punctuation">:</span> nextContacts<span class="token punctuation">,</span> seqNumber<span class="token punctuation">:</span> seqNumber <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n<span class="token keyword">let</span> removeContact <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">{</span>contacts<span class="token punctuation">,</span> seqNumber<span class="token punctuation">}</span><span class="token punctuation">,</span> sender<span class="token punctuation">,</span> contactId<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n  <span class="token keyword">let</span> nextContacts <span class="token operator">=</span> <span class="token class-name">ContactIdMap</span><span class="token punctuation">.</span>remove<span class="token punctuation">(</span>contactId<span class="token punctuation">,</span> contacts<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token keyword">let</span> msg <span class="token operator">=</span>\n    <span class="token keyword">if</span> <span class="token punctuation">(</span>contacts <span class="token operator">===</span> nextContacts<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword">let</span> contact <span class="token operator">=</span> <span class="token class-name">ContactIdMap</span><span class="token punctuation">.</span>find<span class="token punctuation">(</span>contactId<span class="token punctuation">,</span> contacts<span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token punctuation">(</span>contactId<span class="token punctuation">,</span> <span class="token constructor variable">Success</span><span class="token punctuation">(</span>contact<span class="token punctuation">)</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>\n      <span class="token punctuation">(</span>contactId<span class="token punctuation">,</span> <span class="token constructor variable">NotFound</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span><span class="token punctuation">;</span>\n  sender <span class="token operator">&lt;</span><span class="token operator">-</span><span class="token operator">&lt;</span> msg<span class="token punctuation">;</span>\n  <span class="token punctuation">{</span>contacts<span class="token punctuation">:</span> nextContacts<span class="token punctuation">,</span> seqNumber<span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n<span class="token keyword">let</span> updateContact <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">{</span>contacts<span class="token punctuation">,</span> seqNumber<span class="token punctuation">}</span><span class="token punctuation">,</span> sender<span class="token punctuation">,</span> contactId<span class="token punctuation">,</span> contact<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n  <span class="token keyword">let</span> nextContacts <span class="token operator">=</span>\n    <span class="token class-name">ContactIdMap</span><span class="token punctuation">.</span>remove<span class="token punctuation">(</span>contactId<span class="token punctuation">,</span> contacts<span class="token punctuation">)</span> <span class="token operator">|</span><span class="token operator">></span> <span class="token class-name">ContactIdMap</span><span class="token punctuation">.</span>add<span class="token punctuation">(</span>contactId<span class="token punctuation">,</span> contact<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token keyword">let</span> msg <span class="token operator">=</span>\n    <span class="token keyword">if</span> <span class="token punctuation">(</span>nextContacts <span class="token operator">===</span> contacts<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token punctuation">(</span>contactId<span class="token punctuation">,</span> <span class="token constructor variable">Success</span><span class="token punctuation">(</span>contact<span class="token punctuation">)</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>\n      <span class="token punctuation">(</span>contactId<span class="token punctuation">,</span> <span class="token constructor variable">NotFound</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span><span class="token punctuation">;</span>\n  sender <span class="token operator">&lt;</span><span class="token operator">-</span><span class="token operator">&lt;</span> msg<span class="token punctuation">;</span>\n  <span class="token punctuation">{</span>contacts<span class="token punctuation">:</span> nextContacts<span class="token punctuation">,</span> seqNumber<span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n<span class="token keyword">let</span> findContact <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">{</span>contacts<span class="token punctuation">,</span> seqNumber<span class="token punctuation">}</span><span class="token punctuation">,</span> sender<span class="token punctuation">,</span> contactId<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n  <span class="token keyword">let</span> msg <span class="token operator">=</span>\n    <span class="token keyword">try</span> <span class="token punctuation">(</span>contactId<span class="token punctuation">,</span> <span class="token constructor variable">Success</span><span class="token punctuation">(</span><span class="token class-name">ContactIdMap</span><span class="token punctuation">.</span>find<span class="token punctuation">(</span>contactId<span class="token punctuation">,</span> contacts<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token operator">|</span> <span class="token constructor variable">Not_found</span> <span class="token operator">=></span> <span class="token punctuation">(</span>contactId<span class="token punctuation">,</span> <span class="token constructor variable">NotFound</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span><span class="token punctuation">;</span>\n  sender <span class="token operator">&lt;</span><span class="token operator">-</span><span class="token operator">&lt;</span> msg<span class="token punctuation">;</span>\n  <span class="token punctuation">{</span>contacts<span class="token punctuation">,</span> seqNumber<span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>Finally we can put it all together and create the actor:</p>\n<div class="gatsby-highlight">\n      <pre class="language-reason"><code><span class="token keyword">let</span> system <span class="token operator">=</span> start<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword">let</span> contactsService <span class="token operator">=</span>\n  spawn<span class="token punctuation">(</span>\n    <span class="token operator">~</span>name<span class="token operator">=</span><span class="token string">"contacts"</span><span class="token punctuation">,</span>\n    system<span class="token punctuation">,</span>\n    <span class="token punctuation">(</span>state<span class="token punctuation">,</span> <span class="token punctuation">(</span>sender<span class="token punctuation">,</span> msg<span class="token punctuation">)</span><span class="token punctuation">,</span> _<span class="token punctuation">)</span> <span class="token operator">=></span>\n      <span class="token punctuation">(</span>\n        <span class="token keyword">switch</span> msg <span class="token punctuation">{</span>\n        <span class="token operator">|</span> <span class="token constructor variable">CreateContact</span><span class="token punctuation">(</span>contact<span class="token punctuation">)</span> <span class="token operator">=></span> createContact<span class="token punctuation">(</span>state<span class="token punctuation">,</span> sender<span class="token punctuation">,</span> contact<span class="token punctuation">)</span>\n        <span class="token operator">|</span> <span class="token constructor variable">RemoveContact</span><span class="token punctuation">(</span>contactId<span class="token punctuation">)</span> <span class="token operator">=></span> removeContact<span class="token punctuation">(</span>state<span class="token punctuation">,</span> sender<span class="token punctuation">,</span> contactId<span class="token punctuation">)</span>\n        <span class="token operator">|</span> <span class="token constructor variable">UpdateContact</span><span class="token punctuation">(</span>contactId<span class="token punctuation">,</span> contact<span class="token punctuation">)</span> <span class="token operator">=></span> updateContact<span class="token punctuation">(</span>state<span class="token punctuation">,</span> sender<span class="token punctuation">,</span> contactId<span class="token punctuation">,</span> contact<span class="token punctuation">)</span>\n        <span class="token operator">|</span> <span class="token constructor variable">FindContact</span><span class="token punctuation">(</span>contactId<span class="token punctuation">)</span> <span class="token operator">=></span> findContact<span class="token punctuation">(</span>state<span class="token punctuation">,</span> sender<span class="token punctuation">,</span> contactId<span class="token punctuation">)</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">)</span>\n      <span class="token operator">|</span><span class="token operator">></span> <span class="token class-name">Js</span><span class="token punctuation">.</span><span class="token class-name">Promise</span><span class="token punctuation">.</span>resolve<span class="token punctuation">,</span>\n    <span class="token punctuation">{</span>contacts<span class="token punctuation">:</span> <span class="token class-name">ContactIdMap</span><span class="token punctuation">.</span>empty<span class="token punctuation">,</span> seqNumber<span class="token punctuation">:</span> <span class="token number">0</span><span class="token punctuation">}</span>\n  <span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>This should leave you with a working but very basic contacts service.\nWe can now interact with this actor from outside the actor system by calling the query function. In the example below, we are passing in a\nfunction which constructs the final message to sender to the contactsService actor:</p>\n<div class="gatsby-highlight">\n      <pre class="language-reason"><code><span class="token keyword">let</span> createDinesh <span class="token operator">=</span> query<span class="token punctuation">(</span>\n    <span class="token operator">~</span>timeout<span class="token operator">=</span><span class="token number">100</span> <span class="token operator">*</span> milliseconds<span class="token punctuation">,</span>\n    contactsService<span class="token punctuation">,</span>\n    <span class="token punctuation">(</span>tempReference<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">(</span>\n      tempReference<span class="token punctuation">,</span>\n      <span class="token constructor variable">CreateContact</span><span class="token punctuation">(</span><span class="token punctuation">{</span>name<span class="token punctuation">:</span> <span class="token string">"Dinesh Chugtai"</span><span class="token punctuation">,</span> email<span class="token punctuation">:</span> <span class="token string">"dinesh@piedpiper.com"</span><span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token punctuation">)</span>\n  <span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>',timeToRead:3,excerpt:"Actor systems don't live in a vacuum, they need to be available to the outside world. Commonly actor systems are fronted by REST APIs or RPC...",frontmatter:{title:"Querying",cover:"https://unsplash.it/400/300/?random?BoldMage",date:"11/12/2017",category:"reasonml",tags:["getting-started","nact","reason","bucklescript"]},fields:{slug:"/querying"}}},pathContext:{slug:"/querying",category:"reasonml"}}}});
//# sourceMappingURL=path---lesson-reasonml-querying-62c13688e933ac771d26.js.map