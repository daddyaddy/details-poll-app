import React, { useEffect, ChangeEvent } from "react";
import logo from "./assets/svg/details-main-logo.svg";
import headphones from "./assets/svg/heaphones-icon.svg";

import "./App.scss";
import "./app-background.scss";
import "./notification-box.scss";
import "./ornaments-style.scss";

import Knob from "./components/knob-component/knob-component";
import TileOption from "./components/tile-option/tile-option";
import { scrollToRef, disableScroll } from "./utils";
import SVG from "react-inlinesvg";

import musicApplications from "./assets/data/music-applications.json";
import musicGenres from "./assets/data/genres.json";
import GenreOption from "./components/genre-option/genre-option";
import SearchEnginePreview from "./components/search-engine-preview/search-engine-preview";

import ornamentsPathsLeft from "./assets/data/ornaments-paths-left.json";
import ornamentsPathsCenter from "./assets/data/ornaments-paths-center.json";
import ornamentsPathsRight from "./assets/data/ornaments-paths-right.json";

import ornament3 from "./assets/svg/ornament-circle-dots.svg";

export type MusicApplication = {
  name: string;
  logo: string;
};

type Ornament = {
  path: string;
  section: number;
};

export type MusicGenre = {
  name: string;
  color: string;
  icon: string;
};

type AppProps = {};

type AppState = {
  value: number;
  currentSection: number;
  selectedApplications: Array<MusicApplication>;
  bestApplication: MusicApplication | undefined;
  selectedGenres: Array<MusicGenre>;
  bestApplicationRating: {
    songSelection: number | null;
    searchEngine: number | null;
  };
  ourApplicationRating: {
    songSelection: number | null;
    searchEngine: number | null;
  };
};

class App extends React.Component<AppProps, AppState> {
  static readonly sectionCount: number = 12;
  sectionRefs: Array<React.RefObject<HTMLElement>> = [];
  state: AppState = {
    currentSection: 5,
    value: 0,
    selectedApplications: [],
    bestApplication: undefined,
    selectedGenres: [],
    bestApplicationRating: {
      songSelection: null,
      searchEngine: null,
    },
    ourApplicationRating: {
      songSelection: null,
      searchEngine: null,
    },
  };

  constructor(props: AppProps) {
    super(props);
    this.initRefs();
  }

  initRefs() {
    for (let i = 0; i < App.sectionCount; ++i) {
      this.sectionRefs.push(React.createRef());
    }
  }

  componentDidMount() {
    scrollToRef(this.sectionRefs[this.state.currentSection]);
  }

  handleNextSectionButtonClick = () => {
    this.setState(
      {
        currentSection: this.state.currentSection + 1,
      },
      () => {
        scrollToRef(this.sectionRefs[this.state.currentSection]);
      }
    );
  };

  handleNextSection = (i: number = 1) => {
    this.setState(
      {
        currentSection: this.state.currentSection + i,
      },
      () => {
        scrollToRef(this.sectionRefs[this.state.currentSection]);
      }
    );
  };

  handleSelectApplication = (selectedApplication: MusicApplication) => {
    this.setState({
      selectedApplications: [
        ...this.state.selectedApplications,
        selectedApplication,
      ],
    });
  };

  handleUnselectApplication = (unselectedApplication: MusicApplication) => {
    this.setState({
      selectedApplications: this.state.selectedApplications.filter(
        (selectedApplication: MusicApplication) =>
          selectedApplication !== unselectedApplication
      ),
    });
  };

  handleGenreOptionSelect = (selectedGenre: MusicGenre) => {
    this.setState({
      selectedGenres: [...this.state.selectedGenres, selectedGenre],
    });
  };

  handleGenreOptionUnselect = (unselectedGenre: MusicGenre) => {
    this.setState({
      selectedGenres: this.state.selectedGenres.filter(
        (selectedGenre: MusicGenre) => selectedGenre !== unselectedGenre
      ),
    });
  };

  handleBestApplicationSelect = (selectedApplication: MusicApplication) => {
    this.setState({
      bestApplication: selectedApplication,
    });
    this.handleNextSectionButtonClick();
  };

  render() {
    return (
      <div className="App">
        <div className="background">
          <div className="sculpture-box">
            <div className="sculpture"></div>
            <div className="censored-eyes"></div>
          </div>
          <div className="ornaments">
            <div className="ornaments-wrapper left">
              {ornamentsPathsLeft.map((ornament: Ornament) =>
                this.state.currentSection == ornament.section ? (
                  <SVG src={ornament.path} />
                ) : null
              )}
            </div>

            <div className="ornaments-wrapper right">
              {ornamentsPathsRight.map((ornament: Ornament) =>
                this.state.currentSection == ornament.section ? (
                  <SVG src={ornament.path} />
                ) : null
              )}
            </div>
            <div className="ornaments-wrapper center">
              {ornamentsPathsCenter.map((ornament: Ornament) =>
                this.state.currentSection == ornament.section ? (
                  <SVG src={ornament.path} />
                ) : null
              )}
            </div>
          </div>
        </div>

        <div className="content">
          <section className="App-header" ref={this.sectionRefs[0]}>
            <div>
              <div className="motto">
                <div>
                  new <span>alternative</span> <br /> in music world
                </div>
              </div>
              <img className="logo" src={logo} alt="details-logo" />
              <div className="notification-box">
                <div className="notification">
                  <img className="icon" src={headphones} />
                  <div className="text">
                    Załóż słuchawki <br /> dla lepszego efektu
                  </div>
                </div>
              </div>
              <div>
                <button
                  className="main"
                  onClick={this.handleNextSectionButtonClick}
                >
                  start
                </button>
              </div>
              <div className="ornament right top"></div>
            </div>
          </section>
          <section className="A" ref={this.sectionRefs[1]}>
            <div>
              <div className="question-count">1/8</div>
              <div className="question-bar">
                <div>
                  <span>Gdzie słuchasz muzyki?</span>
                </div>
              </div>
              <div className="options">
                {musicApplications.map((musicApplication: MusicApplication) => (
                  <TileOption
                    text={musicApplication.name}
                    image={musicApplication.logo}
                    onSelect={this.handleSelectApplication}
                    onUnselect={this.handleUnselectApplication}
                  />
                ))}
              </div>
              <div>
                <button
                  className="main"
                  onClick={() => {
                    if (this.state.selectedApplications.length === 1) {
                      this.handleBestApplicationSelect(
                        this.state.selectedApplications[0]
                      );
                      this.handleNextSection(2);
                      return;
                    }
                    this.handleNextSection(1);
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
          </section>
          <section className="B" ref={this.sectionRefs[2]}>
            <div>
              <div className="question-count">2/8</div>
              <div className="question-bar">
                <div>
                  <span>Która z wybranych aplikacji jest najlepsza?</span>
                </div>
              </div>
              <div className="options">
                {this.state.selectedApplications.map(
                  (musicApplication: MusicApplication) => (
                    <TileOption
                      text={musicApplication.name}
                      image={musicApplication.logo}
                      onSelect={this.handleBestApplicationSelect}
                    />
                  )
                )}
              </div>
            </div>
          </section>
          <section className="B" ref={this.sectionRefs[3]}>
            <div>
              <div className="question-count">3/8</div>
              <div className="question-bar">
                <div>
                  <span>Jakich gatunków muzycznych słuchasz?</span>
                </div>
              </div>
              <div className="genres">
                {musicGenres.map((musicGenre: any) => (
                  <GenreOption
                    genre={musicGenre}
                    onSelect={this.handleGenreOptionSelect}
                    onUnselect={this.handleGenreOptionUnselect}
                  />
                ))}
              </div>
              <button
                className="main"
                style={{ marginTop: "15px" }}
                onClick={this.handleNextSectionButtonClick}
              >
                Next!
              </button>
            </div>
          </section>
          <section className="C" ref={this.sectionRefs[4]}>
            <div>
              <div className="question-count">4/8</div>
              <div className="question-bar">
                <div>
                  <span>
                    Jak {this.state.bestApplication?.name} radzi sobie z
                    dobieraniem utworów dla ciebie?
                  </span>
                </div>
              </div>
              <div className="knob-area">
                <Knob
                  size={100}
                  numTicks={40}
                  degrees={270}
                  min={1}
                  max={100}
                  value={0}
                />
              </div>
              <button
                className="main"
                onClick={this.handleNextSectionButtonClick}
              >
                Next!
              </button>
            </div>
          </section>
          <section
            className="D"
            ref={this.sectionRefs[5]}
            onClick={this.handleNextSectionButtonClick}
          >
            <div className="preview-bar">
              <div>Generator Gustu Muzycznego</div>
            </div>
            <div className="preview-text">
              Mamy lepszy pomysł! Chcemy wysyłać Ci próbki różnych utworów i
              umożliwić Ci ich ocenianie. Dzięki temu poznamy jeszcze lepiej
              twój gust muzyczny! Zobacz preview: ... Jak oceniasz to
              rozwiązanie?
            </div>
            <div>
              <Knob
                size={100}
                numTicks={40}
                degrees={270}
                min={1}
                max={100}
                value={0}
              />
            </div>
          </section>
          <section className="E" ref={this.sectionRefs[6]}>
            <div>
              <div className="question-count">5/8</div>
              <div className="question-bar">
                <div>
                  <span>
                    Jak oceniasz wyszukiwarkę w{" "}
                    {this.state.bestApplication?.name}?
                  </span>
                </div>
              </div>
              <div className="knob-area">
                <Knob
                  size={100}
                  numTicks={40}
                  degrees={270}
                  min={1}
                  max={100}
                  value={0}
                />
              </div>
              <button
                className="main"
                onClick={this.handleNextSectionButtonClick}
              >
                Next!
              </button>
            </div>
          </section>
          <section
            className="F"
            ref={this.sectionRefs[7]}
            onClick={() => {
              this.handleNextSection();
            }}
          >
            <div className="preview-bar">
              <div>
                <span>Rozbudowana </span>
                <span>wyszukiwarka utworów</span>
              </div>
            </div>
            <div>
              <SearchEnginePreview
                play={this.state.currentSection === 7}
                userSelectedGenre={"house"}
              />
            </div>
          </section>
          <section className="G" ref={this.sectionRefs[8]}>
            <div>
              <div className="question-bar">
                <div>
                  <span>Jak bardzo interesujesz się muzyką?</span>
                </div>
              </div>
              <div className="knob-area">
                <div>
                  <Knob
                    size={100}
                    numTicks={40}
                    degrees={270}
                    min={1}
                    max={100}
                    value={0}
                  />
                </div>
              </div>
              <div className="question-bar">
                <div>
                  <span>Jak często dzielisz się muzyką z innymi?</span>
                </div>
              </div>
              <div className="knob-area">
                <div>Lorem ipsum</div>
              </div>
              <div className="question-bar">
                <div>
                  <span>Czy jesteś otwarty na nowe gatunku muzyczne?</span>
                </div>
              </div>
              <div className="knob-area">
                <div>Lorem ipsum</div>
              </div>
              <button className="main">Done!</button>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

export default App;
