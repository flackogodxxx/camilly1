import {
  useEffect,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react'
import { AnimatePresence, motion } from 'motion/react'
import camillyIntroImage from './assets/camilly.png'
import camillyImage from './assets/camilly-photo.png'
import camillySleepingImage from './assets/camilly-photo1.png'
import emojiImage from './assets/emoji.png'

const easeOut = [0.22, 1, 0.36, 1] as const
const OUTSIDE_COOLDOWN_SECONDS = 120
const TIMER_RADIUS = 36
const TIMER_CIRCUMFERENCE = 2 * Math.PI * TIMER_RADIUS

type Screen = 'intro' | 'question' | 'outside' | 'prize' | 'ok'

const screenOrder: Screen[] = ['intro', 'question', 'outside', 'prize', 'ok']

const screenVariants = {
  initial: { opacity: 0, y: 28, scale: 0.985 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: easeOut,
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: -18,
    scale: 0.99,
    transition: { duration: 0.38, ease: easeOut },
  },
} as const

const itemVariants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: easeOut },
  },
} as const

const choices = [
  {
    label: 'Não fui 😴',
    description: 'Preguicosa ne.',
    tone: 'soft',
  },
  {
    label: 'Fui sim! 🎒',
    description: 'Milagre de deus',
    tone: 'solid',
  },
] as const

const outsideSteps = [
  {
    number: '1',
    title: 'Vai para fora',
    description: 'Sai pela parte de trás e para por um segundo, tá?',
  },
  {
    number: '2',
    title: 'Olha para baixo',
    description: 'Só depois disso toca em continuar pra ver o próximo passo.',
  },
] as const

function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

// Floating hearts component
function FloatingHearts() {
  const hearts = ['♡', '♥', '✿', '♡', '✦', '♥']
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {hearts.map((h, i) => (
        <motion.span
          key={i}
          className="absolute text-[#e8b4c0]/60 select-none"
          style={{
            left: `${10 + i * 16}%`,
            top: `${20 + (i % 3) * 22}%`,
            fontSize: `${0.7 + (i % 3) * 0.3}rem`,
          }}
          animate={{
            y: [0, -18, 0],
            opacity: [0.3, 0.7, 0.3],
            rotate: [0, i % 2 === 0 ? 15 : -15, 0],
          }}
          transition={{
            duration: 3 + i * 0.7,
            ease: 'easeInOut',
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.4,
          }}
        >
          {h}
        </motion.span>
      ))}
    </div>
  )
}

function App() {
  const [screen, setScreen] = useState<Screen>('intro')
  const [outsideCooldownEndsAt, setOutsideCooldownEndsAt] = useState<
    number | null
  >(null)
  const [outsideCountdown, setOutsideCountdown] = useState(
    OUTSIDE_COOLDOWN_SECONDS,
  )

  useEffect(() => {
    if (screen !== 'outside' || outsideCooldownEndsAt === null) return

    const updateCountdown = () => {
      const remaining = Math.max(
        0,
        Math.ceil((outsideCooldownEndsAt - Date.now()) / 1000),
      )

      setOutsideCountdown(remaining)
    }

    updateCountdown()
    const interval = window.setInterval(updateCountdown, 250)

    return () => window.clearInterval(interval)
  }, [screen, outsideCooldownEndsAt])

  const currentStep = screenOrder.indexOf(screen)
  const outsideProgress =
    (OUTSIDE_COOLDOWN_SECONDS - outsideCountdown) / OUTSIDE_COOLDOWN_SECONDS
  const timerStrokeOffset =
    TIMER_CIRCUMFERENCE - TIMER_CIRCUMFERENCE * Math.max(0, outsideProgress)
  const outsideUnlocked = outsideCountdown === 0

  const startOutsideFlow = () => {
    setOutsideCooldownEndsAt(Date.now() + OUTSIDE_COOLDOWN_SECONDS * 1000)
    setOutsideCountdown(OUTSIDE_COOLDOWN_SECONDS)
    setScreen('outside')
  }

  const goBack = () => {
    if (screen === 'question') setScreen('intro')
    if (screen === 'outside') setScreen('question')
    if (screen === 'prize') setScreen('outside')
  }

  return (
    <main className="relative isolate min-h-svh overflow-hidden text-[var(--ink)]">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.92),_transparent_34%),linear-gradient(180deg,rgba(255,248,250,0.88),rgba(240,224,230,0.96))]" />
        <motion.div
          animate={{ x: [0, 22, 0], y: [0, -12, 0] }}
          transition={{
            duration: 18,
            ease: 'easeInOut',
            repeat: Number.POSITIVE_INFINITY,
          }}
          className="absolute -left-12 top-10 h-72 w-72 rounded-full bg-[#f4c2d0]/50 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -18, 0], y: [0, 14, 0] }}
          transition={{
            duration: 16,
            ease: 'easeInOut',
            repeat: Number.POSITIVE_INFINITY,
          }}
          className="absolute -right-14 top-20 h-80 w-80 rounded-full bg-[#f8d4c0]/50 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 12, 0], y: [0, -16, 0] }}
          transition={{
            duration: 22,
            ease: 'easeInOut',
            repeat: Number.POSITIVE_INFINITY,
          }}
          className="absolute bottom-6 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#c49dae]/22 blur-3xl"
        />
      </div>

      <section className="relative mx-auto flex min-h-svh w-full max-w-[430px] flex-col px-4 pb-[calc(1.35rem+env(safe-area-inset-bottom))] pt-[calc(0.9rem+env(safe-area-inset-top))]">
        {screen !== 'ok' ? (
          <TopBar currentStep={currentStep} canGoBack={screen !== 'intro'} onBack={goBack} />
        ) : null}

        <AnimatePresence mode="wait">
          {/* ═══════════════ INTRO ═══════════════ */}
          {screen === 'intro' ? (
            <motion.div
              key="intro"
              variants={screenVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-1 flex-col"
            >
              <motion.div
                variants={itemVariants}
                className="relative overflow-hidden rounded-[2.55rem] border border-white/65 bg-white/40 p-3 shadow-[0_28px_70px_rgba(72,43,53,0.16)] backdrop-blur-xl"
              >
                <div className="relative overflow-hidden rounded-[2.1rem]">
                  <motion.img
                    src={camillyIntroImage}
                    alt="Foto da Camilly"
                    initial={{ scale: 1.08, y: 14 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ duration: 1.05, ease: easeOut }}
                    className="h-[72svh] min-h-[30rem] max-h-[42rem] w-full object-cover object-[20%_50%]"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,13,17,0.0)_0%,rgba(20,13,17,0.05)_50%,rgba(20,13,17,0.80)_100%)]" />

                  <div className="absolute left-4 top-4 rounded-full border border-white/24 bg-white/14 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white backdrop-blur-md">
                    💌 pra você
                  </div>

                  <div className="absolute inset-x-4 bottom-3 rounded-[1.85rem] border border-white/14 bg-[rgba(29,18,24,0.28)] p-4 backdrop-blur-xl">
                    <h1 className="font-display text-[clamp(2.8rem,13vw,4.4rem)] leading-[0.86] tracking-[-0.055em] text-white">
                      <span className="block">Oi,</span>
                      <span className="mt-0.5 block italic text-[#f7dbe3]">
                        camilly ♡
                      </span>
                    </h1>
                    <p className="mt-3 max-w-[24ch] text-[0.93rem] leading-6 text-white/80">
                      Eu preparei uma coisinha especial pra você. Não demora, prometo. Só segue o roteiro.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="mt-4 rounded-[1.8rem] border border-white/70 bg-white/60 p-4 shadow-[0_16px_42px_rgba(91,60,71,0.10)] backdrop-blur-lg"
              >
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#b07a8e]">
                  ✨ uma surpresinha
                </p>
                <p className="mt-2 text-[0.96rem] leading-6 text-[var(--muted)]">
                  Isso aqui foi feito com carinho só pra você. Toca em continuar e vai fluindo. 🌸
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-4">
                <ActionButton onClick={() => setScreen('question')}>
                  Continuar →
                </ActionButton>
              </motion.div>
            </motion.div>

          ) : screen === 'question' ? (
            /* ═══════════════ QUESTION ═══════════════ */
            <motion.div
              key="question"
              variants={screenVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-1 flex-col pb-1"
            >
              <motion.div
                variants={itemVariants}
                className="relative overflow-hidden rounded-[2.55rem] border border-white/65 bg-[#22161b] shadow-[0_32px_82px_rgba(67,42,50,0.22)]"
              >
                <motion.img
                  src={camillyImage}
                  alt="Foto da Camilly"
                  initial={{ scale: 1.06, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ duration: 1.05, ease: easeOut }}
                  className="h-[72svh] min-h-[30rem] max-h-[44rem] w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,10,13,0.06)_0%,rgba(15,10,13,0.14)_36%,rgba(15,10,13,0.84)_100%)]" />
                <div className="absolute left-4 top-4 rounded-full border border-white/24 bg-white/14 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-white backdrop-blur-md">
                  camilly 🌙
                </div>
                <div className="absolute inset-x-4 bottom-4 rounded-[1.95rem] border border-white/14 bg-white/10 p-4 text-white backdrop-blur-xl">
                  <p className="font-display text-[2.15rem] leading-[0.88] tracking-[-0.05em]">
                    tenho uma
                    <span className="block italic text-[#f3d7df]">
                      perguntinha
                    </span>
                  </p>
                  <p className="mt-2 font-body text-[0.94rem] leading-6 text-white/74">
                    Vou ser bem direta aqui, juro que não tem enrolação. 👀
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="mt-3 rounded-[2.35rem] border border-white/70 bg-[rgba(255,249,246,0.92)] p-5 shadow-[0_24px_70px_rgba(76,48,58,0.16)] backdrop-blur-xl"
              >
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#b07a88]">
                  responde certo viu
                </p>
                <h2 className="mt-3 font-display text-[2.45rem] leading-[0.9] tracking-[-0.055em] text-[#2d1f25]">
                  VOCÊ FOI PRA FACULDADE HOJE?
                </h2>

                <div className="mt-6 grid gap-3">
                  {choices.map((choice, index) => (
                    <ChoiceCard
                      key={choice.label}
                      label={choice.label}
                      description={choice.description}
                      tone={choice.tone}
                      index={index + 1}
                      onClick={() =>
                        choice.tone === 'soft'
                          ? startOutsideFlow()
                          : setScreen('ok')
                      }
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>

          ) : screen === 'outside' ? (
            /* ═══════════════ OUTSIDE ═══════════════ */
            <motion.div
              key="outside"
              variants={screenVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-1 flex-col pb-1"
            >
              <motion.div
                variants={itemVariants}
                className="relative overflow-hidden rounded-[2.55rem] border border-white/65 bg-[rgba(255,249,245,0.88)] p-5 shadow-[0_28px_80px_rgba(72,46,55,0.16)] backdrop-blur-xl"
              >
                <div className="pointer-events-none absolute -left-10 top-4 h-28 w-28 rounded-full bg-[#f4c4bc]/72 blur-3xl" />
                <div className="pointer-events-none absolute -right-10 top-8 h-36 w-36 rounded-full bg-[#d7afbc]/30 blur-3xl" />

                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <div className="inline-flex rounded-full border border-white/80 bg-white/70 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[#9d6c7c]">
                      missão especial FIA!
                    </div>
                    <h2 className="mt-4 font-display text-[2.55rem] leading-[0.9] tracking-[-0.055em] text-[#2b1f24]">
                      Vai lá fora fazendo favor
                      <span className="block italic text-[#8a4d60]">
                        por um segundo.
                      </span>
                    </h2>
                  </div>

                  <div className="relative h-24 w-24 shrink-0">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 96 96">
                      <circle
                        cx="48"
                        cy="48"
                        r={TIMER_RADIUS}
                        stroke="rgba(152,100,118,0.14)"
                        strokeWidth="8"
                        fill="none"
                      />
                      <motion.circle
                        cx="48"
                        cy="48"
                        r={TIMER_RADIUS}
                        stroke="url(#timerGradient)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        fill="none"
                        strokeDasharray={TIMER_CIRCUMFERENCE}
                        animate={{ strokeDashoffset: timerStrokeOffset }}
                        initial={false}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                      />
                      <defs>
                        <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#c47088" />
                          <stop offset="100%" stopColor="#3c2931" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-[0.55rem] font-semibold uppercase tracking-[0.22em] text-[#9d6875]">
                        aguarda
                      </span>
                      <span className="mt-1 font-body text-[0.94rem] font-semibold tracking-[0.1em] text-[#36252d]">
                        {formatCountdown(outsideCountdown)}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="mt-5 text-[1rem] leading-7 text-[var(--muted)]">
                  Vai até lá fora, pela parte de trás, e olha pra baixo com calma (em paz voce esta). Sem pressa, tá? Quero que você veja direitinho.
                </p>

                {/* Steps */}
                <div className="mt-6 rounded-[2rem] border border-white/80 bg-[rgba(255,252,249,0.9)] p-4">
                  <div className="grid gap-3">
                    {outsideSteps.map((step, index) => (
                      <div
                        key={step.number}
                        className={`rounded-[1.6rem] border p-4 ${index === 0
                          ? 'border-[#f0ccd4] bg-[rgba(255,243,244,0.92)]'
                          : 'border-white/90 bg-white/90'
                          }`}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[1.1rem] text-[0.8rem] font-semibold ${index === 0
                              ? 'bg-[#5a2d3a] text-white'
                              : 'bg-[#f4dde2] text-[#7a4d5a]'
                              }`}
                          >
                            {step.number}
                          </div>
                          <div>
                            <p className="text-[0.84rem] font-semibold uppercase tracking-[0.16em] text-[#633d48]">
                              {step.title}
                            </p>
                            <p className="mt-2 text-[0.94rem] leading-6 text-[#8a6870]">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timer + button block */}
                <div className="mt-5 rounded-[2rem] bg-[linear-gradient(180deg,#5a2f3c_0%,#3a1f28_100%)] p-4 text-white shadow-[0_22px_44px_rgba(58,31,40,0.28)]">
                  <div className="flex items-center justify-between gap-4 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-white/60">
                    <span>⏳ aguardando</span>
                    <span>{outsideUnlocked ? '✓ pronto!' : formatCountdown(outsideCountdown)}</span>
                  </div>

                  <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/12">
                    <motion.div
                      initial={false}
                      animate={{ width: `${Math.max(0, outsideProgress) * 100}%` }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="h-full rounded-full bg-[linear-gradient(90deg,#f4b8c8_0%,#ffe8d6_100%)]"
                    />
                  </div>

                  <ActionButton
                    onClick={() => setScreen('prize')}
                    disabled={!outsideUnlocked}
                    className="mt-4"
                    light
                  >
                    {outsideUnlocked
                      ? 'Já estou lá fora! →'
                      : `Espera mais ${formatCountdown(outsideCountdown)}`}
                  </ActionButton>
                </div>
              </motion.div>
            </motion.div>

          ) : screen === 'prize' ? (
            /* ═══════════════ PRIZE ═══════════════ */
            <motion.div
              key="prize"
              variants={screenVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-1 flex-col pb-1"
            >
              <motion.div
                variants={itemVariants}
                className="relative overflow-hidden rounded-[2.6rem] border border-white/70 bg-[rgba(255,249,244,0.90)] p-5 shadow-[0_28px_80px_rgba(74,48,58,0.16)] backdrop-blur-xl"
              >
                <div className="pointer-events-none absolute -left-10 top-10 h-32 w-32 rounded-full bg-[#f5d0bc]/70 blur-3xl" />
                <div className="pointer-events-none absolute -right-10 top-16 h-40 w-40 rounded-full bg-[#e0a9be]/30 blur-3xl" />

                <div className="flex items-center justify-between gap-3">
                  <div className="rounded-full border border-white/80 bg-white/72 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#9d6070]">
                    🏆 surpresa desbloqueada
                  </div>
                  <div className="rounded-full bg-[#4a2d38] px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white shadow-[0_12px_24px_rgba(74,45,56,0.22)]">
                    zzz club 😴
                  </div>
                </div>

                <h2 className="mt-5 font-display text-[2.7rem] leading-[0.9] tracking-[-0.06em] text-[#2f2027]">
                  ESSE AQUI É
                  <span className="mt-1 block italic text-[#9a4d62]">
                    seu prêmio
                  </span>
                  <span className="mt-1 block text-[0.92em]">
                    por dormir o dia todo
                  </span>
                </h2>

                <p className="mt-4 max-w-[26ch] text-[0.98rem] leading-7 text-[var(--muted)]">
                  Precisava guardar esse registro histórico em algum lugar seguro. Aqui é o lugar. 😌
                </p>

                <div className="relative mt-7 pb-2">
                  <div className="absolute inset-x-5 top-3 bottom-0 rotate-[-4deg] rounded-[2.2rem] bg-[rgba(180,95,120,0.14)]" />
                  <div className="absolute inset-x-3 top-0 bottom-3 rotate-[3deg] rounded-[2.2rem] border border-white/60 bg-white/44" />
                  <div className="relative overflow-hidden rounded-[2.2rem] border border-white/85 bg-white p-2 shadow-[0_24px_50px_rgba(72,45,55,0.18)]">
                    <img
                      src={camillySleepingImage}
                      alt="Foto da Camilly dormindo — o troféu"
                      className="w-full rounded-[1.7rem] object-cover object-center"
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="mt-4 rounded-[1.95rem] border border-white/70 bg-white/60 p-4 shadow-[0_16px_42px_rgba(91,60,71,0.10)] backdrop-blur-lg"
              >
                <p className="font-display text-[2rem] italic leading-none text-[#844460]">
                  troféu oficial 🏆
                </p>
                <p className="mt-3 text-[0.96rem] leading-6 text-[var(--muted)]">
                  Essa foto merecia um palco. Agora ela tem um.
                </p>
                <ActionButton onClick={() => setScreen('ok')} className="mt-4">
                  Ver a mensagem final ♡
                </ActionButton>
              </motion.div>
            </motion.div>

          ) : (
            /* ═══════════════ OK / FINAL ═══════════════ */
            <motion.div
              key="ok"
              variants={screenVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-1 flex-col justify-center py-4"
            >
              <motion.div
                variants={itemVariants}
                className="relative overflow-hidden rounded-[2.8rem] border border-white/80 bg-[rgba(255,248,244,0.94)] p-6 text-center shadow-[0_30px_80px_rgba(151,80,100,0.18)] backdrop-blur-xl"
              >
                <FloatingHearts />

                <div className="relative">
                  <div className="inline-flex rounded-full border border-[#f0c8d0] bg-white/80 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#a06070]">
                    🌸 pra você, camilly
                  </div>

                  <h2 className="mt-6 font-display text-[4.4rem] leading-none tracking-[-0.07em] text-[#2f1e28]">
                    BEMTIVI DORMINDO
                  </h2>

                  <p className="mx-auto mt-4 max-w-[22ch] text-[1.02rem] leading-[1.75] text-[#7a5060]">
                    Essa foi a sua surpresa de hoje. 💌<br />
                    Espero que tenha colocado um sorriso no seu rosto.
                  </p>

                  <p className="mx-auto mt-3 max-w-[22ch] text-[0.9rem] leading-relaxed text-[#a08090]">
                    Você é a pessoa mais...
                  </p>

                  <div className="relative mt-8 flex justify-center">
                    <div className="relative h-[18rem] w-[18rem] max-w-full">
                      <motion.div
                        animate={{ scale: [0.82, 1.2, 1.34], opacity: [0.22, 0.10, 0] }}
                        transition={{
                          duration: 2.8,
                          ease: 'easeOut',
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                        className="absolute inset-6 rounded-full border border-[#f099b0]/60"
                      />
                      <motion.div
                        animate={{ scale: [0.68, 1.08, 1.22], opacity: [0.26, 0.10, 0] }}
                        transition={{
                          duration: 2.8,
                          ease: 'easeOut',
                          repeat: Number.POSITIVE_INFINITY,
                          delay: 0.9,
                        }}
                        className="absolute inset-4 rounded-full border border-[#f4aec0]/50"
                      />

                      <motion.div
                        initial={{ scale: 0.18, opacity: 0, rotate: -14 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        transition={{ delay: 0.16, duration: 0.95, ease: easeOut }}
                        className="relative flex h-full w-full items-center justify-center"
                      >
                        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_26%,#ffe0ec_0%,#ffb8cc_34%,#f490ae_68%,#e07090_100%)] shadow-[0_28px_56px_rgba(210,100,140,0.36)]" />
                        <div className="absolute inset-4 rounded-full border border-white/40" />
                        <img
                          src={emojiImage}
                          alt="Coração"
                          className="relative h-40 w-40 object-contain drop-shadow-[0_14px_18px_rgba(160,60,90,0.26)]"
                        />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  )
}

type TopBarProps = {
  currentStep: number
  canGoBack: boolean
  onBack: () => void
}

function TopBar({ currentStep, canGoBack, onBack }: TopBarProps) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3 px-1">
      {canGoBack ? (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-white/70 bg-white/62 px-4 text-[0.74rem] font-semibold uppercase tracking-[0.22em] text-[#8a5a68] shadow-[0_12px_26px_rgba(98,69,79,0.08)] backdrop-blur-md"
        >
          <span className="text-base leading-none">‹</span>
          voltar
        </button>
      ) : (
        <div className="inline-flex h-11 items-center rounded-full border border-white/70 bg-white/54 px-4 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#a07080] backdrop-blur-md">
          💌 surpresa
        </div>
      )}

      <div className="flex items-center gap-2 rounded-full border border-white/70 bg-white/58 px-4 py-3 backdrop-blur-md">
        {screenOrder.map((step, index) => (
          <span
            key={step}
            className={
              index <= currentStep
                ? 'h-1.5 w-7 rounded-full bg-[linear-gradient(90deg,#b86080_0%,#f4b0c4_100%)]'
                : 'h-1.5 w-3 rounded-full bg-[#e8d0d4]'
            }
          />
        ))}
      </div>

      <div className="flex h-11 min-w-11 items-center justify-center rounded-full border border-white/70 bg-white/62 px-3 text-[0.76rem] font-semibold uppercase tracking-[0.2em] text-[#8a5a68] shadow-[0_12px_26px_rgba(98,69,79,0.08)] backdrop-blur-md">
        {String(currentStep + 1).padStart(2, '0')}
      </div>
    </div>
  )
}

type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  light?: boolean
}

function ActionButton({
  children,
  className = '',
  disabled = false,
  light = false,
  ...props
}: ActionButtonProps) {
  return (
    <motion.button
      type="button"
      whileTap={disabled ? undefined : { scale: 0.986 }}
      transition={{ duration: 0.2, ease: easeOut }}
      disabled={disabled}
      className={`inline-flex w-full items-center justify-center rounded-full px-6 py-4 text-[0.92rem] font-semibold uppercase tracking-[0.22em] ${disabled
        ? 'cursor-not-allowed border border-white/20 bg-white/28 text-white/70 shadow-none'
        : light
          ? 'border border-white/80 bg-white text-[#4a2d38] shadow-[0_16px_28px_rgba(255,255,255,0.16)]'
          : 'border border-[#a06878]/14 bg-[linear-gradient(180deg,#6a3d4e_0%,#3e2230_100%)] text-white shadow-[0_18px_34px_rgba(74,42,58,0.28)]'
        } ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}

type ChoiceCardProps = {
  label: string
  description: string
  tone: 'soft' | 'solid'
  index: number
  onClick: () => void
}

function ChoiceCard({
  label,
  description,
  tone,
  index,
  onClick,
}: ChoiceCardProps) {
  const solid = tone === 'solid'

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.986 }}
      transition={{ duration: 0.2, ease: easeOut }}
      onClick={onClick}
      className={`group rounded-[1.75rem] p-4 text-left ${solid
        ? 'border border-[#6a3a4a]/14 bg-[linear-gradient(180deg,#6a3d4a_0%,#3e2230_100%)] text-white shadow-[0_20px_34px_rgba(74,42,58,0.24)]'
        : 'border border-white/82 bg-white/80 text-[#34252b] shadow-[0_16px_28px_rgba(98,69,79,0.08)]'
        }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[1.2rem] text-[0.76rem] font-semibold uppercase tracking-[0.16em] ${solid
            ? 'border border-white/16 bg-white/12 text-white'
            : 'border border-[#e8d0d4] bg-[#fff0f2] text-[#8a5a66]'
            }`}
        >
          {String(index).padStart(2, '0')}
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-[1rem] font-semibold tracking-[0.06em]">
            {label}
          </div>
          <div
            className={`mt-2 text-[0.9rem] leading-6 ${solid ? 'text-white/72' : 'text-[#8a6870]'
              }`}
          >
            {description}
          </div>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[1.2rem] text-lg ${solid ? 'bg-white/12 text-white' : 'bg-[#fae8ea] text-[#8a5968]'
            }`}
        >
          ›
        </div>
      </div>
    </motion.button>
  )
}

export default App
