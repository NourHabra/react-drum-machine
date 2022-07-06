import "./App.css";
import React from "react";
import { bankOne, bankTwo } from "./banks";

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			volume: 0.75,
			muted: false,
			banks: [bankOne, bankTwo],
			activeBank: 0,
		};
		this.setVolume = this.setVolume.bind(this);
		this.mute = this.mute.bind(this);
		this.switchBank = this.switchBank.bind(this);
		this.playAudio = this.playAudio.bind(this);
	}

	setVolume(vol) {
		this.setState((state) => {
			if (vol == 0) return { volume: vol, muted: true };
			else if (state.volume != 0 && vol != 0)
				return { volume: vol, muted: false };
			else return { volume: vol, muted: state.muted };
		});
	}

	mute() {
		this.setState((state) => {
			if (state.muted) return { volume: 0.75, muted: false };
			else return { volume: 0, muted: true };
		});
	}

	switchBank() {
		this.setState((state) => {
			if (state.activeBank == 0) return { activeBank: 1 };
			else return { activeBank: 0 };
		});
		document.getElementById("display").innerText = "Bank Changed";
	}

	playAudio(e) {
		const spl = document.getElementById(e.target.value);
		spl.pause();
		spl.currentTime = 0;
		spl.volume = this.state.volume;
		spl.play();

		this.state.banks[this.state.activeBank].forEach((sample) => {
			if (e.target.value == sample[2]) {
				document.getElementById("display").innerText = sample[1];
			}
		});
	}

	componentDidMount() {
		document.addEventListener("keydown", (e) => {
			const spl = document.getElementById(e.key.toUpperCase());
			spl.pause();
			spl.currentTime = 0;
			spl.volume = this.state.volume;
			spl.play();

			// Why is this not like the function before?
			// idk it doesn't work like that and I've spent way
			// too much time trying to pass the tests
			let sample_name = "";
			this.state.banks[this.state.activeBank].forEach((sample) => {
				if (e.key.toUpperCase() == sample[2]) {
					sample_name = sample[1];
				}
			});
			document.getElementById("display").innerText = sample_name;
		});
	}

	render() {
		let bank = this.state.banks[this.state.activeBank];
		return (
			<div className="App" id="drum-machine">
				<div className="pads">
					{bank.map((sample) => (
						<button
							onClick={this.playAudio}
							value={sample[2]}
							className="drum-pad"
							id={sample[1].replace(" ", "-")}
						>
							<p>{sample[2]}</p>
							<audio
								src={sample[0]}
								className="clip"
								id={sample[2]}
							></audio>
						</button>
					))}
				</div>
				<div className="controls">
					<div id="display"></div>
					<div className="volume-controls">
						{!this.state.muted && (
							<img
								src="https://img.icons8.com/material-rounded/50/000000/speaker.png"
								className="mute"
								onClick={this.mute}
							/>
						)}
						{this.state.muted && (
							<img
								src="https://img.icons8.com/material-rounded/48/000000/mute.png"
								className="mute"
								onClick={this.mute}
							/>
						)}
						<input
							type="range"
							min={0}
							max={1}
							step={0.01}
							value={this.state.volume}
							onChange={(event) => {
								this.setVolume(event.target.valueAsNumber);
							}}
							className="volume"
						/>
					</div>
					<button className="change-bank" onClick={this.switchBank}>
						Change Bank
					</button>
				</div>
			</div>
		);
	}
}

export default App;
