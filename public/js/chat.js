
const socket = io();

// Elements
const $messageForm = document.querySelector("#messageForm");
const $messageFormInput = $messageForm.querySelector('input[name="message"]');
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocationButton = document.querySelector("#sendLocation");
const $messages = document.querySelector("#messages");
// const $location = document.querySelector("#location")

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML
const locationTemplate = document.querySelector("#location-template").innerHTML
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })


const autoscroll = () => {
	// New message element
	const $newMessage = $messages.lastElementChild

	// Height of the new message
	const newMessageStyles = getComputedStyle($newMessage)
	const newMessageMargin = parseInt(newMessageStyles.marginBottom)
	const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

	// Visible height
	const visibleHeight = $messages.offsetHeight

	// Height of messages container
	const containerHeight = $messages.scrollHeight

	// How far have I scrolled?
	const scrollOffset = $messages.scrollTop + visibleHeight

	if (containerHeight - newMessageHeight <= scrollOffset) {
		$messages.scrollTop = $messages.scrollHeight
	}
}

socket.on("message", (message) => {
	console.log(message);
	const html = Mustache.render(messageTemplate, {
		username: message.username,
		message: message.text,
		createdAt: moment(message.createdAt).format('h:mm a')
	});
	$messages.insertAdjacentHTML("beforeend", html);
	autoscroll()
});

socket.on("locationMessage", (locationMessage) => {
	console.log(locationMessage)
	const html = Mustache.render(locationTemplate, {
		username: locationMessage.username,
		url: locationMessage.url,
		createdAt: moment(locationMessage.createdAt).format('h:mm a')
	})
	$messages.insertAdjacentHTML("beforeend", html)
	autoscroll()
})

socket.on('roomData', ({ room, users }) => {
	const html = Mustache.render(sidebarTemplate, {
		room,
		users
	})
	document.querySelector('#sidebar').innerHTML = html
})


// socket.on("welcomeMessage",(welcomeMessage) => {
// 	console.log(welcomeMessage);
// });

$messageForm.addEventListener("submit", (e) => {
	e.preventDefault();

	// Disabling button on click while message is being sent.
	$messageFormButton.setAttribute("disabled", "disabled");

	const message = e.target.elements.message.value;

	socket.emit("sendMessage", message, (error) => {
		// Re-enabling button, when message is sent.
		$messageFormButton.removeAttribute("disabled");
		$messageFormInput.value = null;
		$messageFormInput.focus();

		if (error) {
			return console.log(error);
		}
		console.log("Message delivered.");
	});

});


$sendLocationButton.addEventListener("click", () => {
	$sendLocationButton.setAttribute("disabled", "disabled");

	if (!navigator.geolocation) {
		return alert("Geolocation not available, for your browser");
	}
	navigator.geolocation.getCurrentPosition((position) => {
		socket.emit(
			"sendLocation",
			{
				latitude: position.coords.latitude,
				longitude: position.coords.longitude,
			},
			() => {
				console.log('Location Shared!');
				$sendLocationButton.removeAttribute("disabled");
			}
		);
	});
});

socket.emit('join', { username, room }, (error) => {
	if (error) {
		alert(error)
		location.href = '/'
	}

})