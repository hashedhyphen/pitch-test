import { Button, Link, Slider, Typography } from "@material-ui/core"
import { h } from "preact"
import { useCallback, useState } from "preact/hooks"
import * as style from "./style.css"

const sliderRange = 100
const freqRange = sliderRange / 2
const minFreq = randomMinFreq(freqRange)
const maxFreq = minFreq + freqRange

function randomMinFreq(freqRange: number): number {
  const shift = Math.round(freqRange * Math.random())
  return 440 - shift
}

function sliderPosToFreq(sliderPos: number): number {
  const ratio = sliderPos / 100
  const freq = (1 - ratio) * minFreq + ratio * maxFreq
  return Math.round(10 * freq) / 10
}

function buildTweetIntentURL(freq: number): string {
  const text = `私の 440Hz は『${freq}Hz』でした！あなたも音感をテストしよう！`
  const url = window.location.href.split("?")[0]
  const hashtags = "440Hzを当てるやつ"

  const usp = new URLSearchParams()
  usp.set("text", text)
  usp.set("url", url)
  usp.set("hashtags", hashtags)

  return `https://twitter.com/intent/tweet?${usp}`
}

type Props = {
  updateOscillator: (frequency: number, shouldPlay: boolean) => void
}

function UI({ updateOscillator }: Props) {
  const initialSliderPos = 50
  const initialFreq = sliderPosToFreq(initialSliderPos)

  const [sliderPos, setSliderPos] = useState(initialSliderPos)
  const [frequency, setFrequency] = useState(initialFreq)
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlayButtonClick = useCallback(() => {
    const play = !isPlaying
    setIsPlaying(play)

    updateOscillator(frequency, play)
  }, [frequency, isPlaying])

  const handleSliderChange = useCallback(
    (_: any, pos: number | number[]) => {
      if (typeof pos === "number") {
        setSliderPos(pos)

        const freq = sliderPosToFreq(pos)
        setFrequency(freq)

        updateOscillator(freq, isPlaying)
      }
    },
    [frequency, isPlaying]
  )

  const handleTweetButtonClick = useCallback(() => {
    window.location.href = buildTweetIntentURL(frequency)
  }, [frequency])

  return (
    <div className={style.container}>
      <Typography variant="h5" component="h1" className={style.title}>
        440Hzを当てるやつ！
      </Typography>
      <Slider
        value={sliderPos}
        onChange={handleSliderChange}
        aria-labelledby="continuous-slider"
      />
      <div className={style.btnList}>
        <Button
          variant="contained"
          color={isPlaying ? "secondary" : "default"}
          onClick={handlePlayButtonClick}
        >
          {isPlaying ? "停止" : "再生"}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleTweetButtonClick}
        >
          決定！
        </Button>
      </div>
      <Typography className={style.repo} variant="caption">
        ※消音モードをオフにしてください
      </Typography>
      <Typography className={style.repo} variant="caption">
        <Link href="https://github.com/hashedhyphen/pitch-test">
          GitHub Repo
        </Link>
      </Typography>
    </div>
  )
}

export default UI
