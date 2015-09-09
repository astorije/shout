{{#each channels}}
<div id="chan-{{id}}" data-title="{{name}}" data-id="{{id}}" data-type="{{type}}" class="chan {{type}}">
	<div class="header">
		<button class="lt"></button>
		<button class="rt"></button>
		<div class="right">
			<button class="button close">
				{{#equal type "lobby"}}
					Disconnect
				{{else}}
					{{#equal type "query"}}
						Close
					{{else}}
						Leave
					{{/equal}}
				{{/equal}}
			</button>
		</div>
		<span class="title">{{name}}</span>
		{{#equal type "query"}}
			<button class="icon otr stopped" data-toggle="tooltip" data-placement="bottom" title="Start encrypted mode (using OTR)"></button>
			<button class="icon otr started" data-toggle="tooltip" data-placement="bottom" title="Stop encrypted mode"></button>
		{{/equal}}
		<span class="topic">{{{parse topic}}}</span>
	</div>
	<div class="chat">
		<div class="show-more {{#equal messages.length 100}}show{{/equal}}">
			<button class="show-more-button" data-id="{{id}}">
				Show more
			</button>
		</div>
		<div class="messages">
			{{partial "msg"}}
		</div>
	</div>
	<aside class="sidebar">
		<div class="users">
			{{partial "user"}}
		</div>
	</aside>
</div>
{{/each}}
