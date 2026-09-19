import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import {
  ArrowLeft, ArrowRight, Cpu, Brain, Mic, FileText, Wrench,
  Zap, Shield, Layers, Building2, Home, Landmark,
  Check, ChevronRight, Lock, Heart,
  Sparkles, Eye, MessageSquare, Database, ScrollText, Globe2, Infinity as InfinityIcon,
} from 'lucide-react';

/* ====================================================================
 * 森卫安护｜Apertus 1.5 多模态大模型 · AI 大脑内核
 * 研发方：瑞士 AI 倡议（Swiss AI Initiative）· ETH Zurich · EPFL · CSCS
 * Apache 2.0 全开源，对接 AegisEdge Ai5 端侧芯片，支撑 B/C/G 三类部署
 * 风格：深色科技风 + 白底卡片，主色深蓝 / 青绿 / 暖白，金色强调
 * ==================================================================== */

/* ---------- 数字滚动计数组件 ---------- */
function CountUp({ to, duration = 1.8, suffix = '', prefix = '', decimals = 0, className = '' }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf;
    const timer = setTimeout(() => {
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / (duration * 1000), 1);
        const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
        setValue(to * eased);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, 150);
    return () => {
      clearTimeout(timer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [to, duration]);

  return (
    <span className={className}>
      {prefix}{value.toFixed(decimals)}{suffix}
    </span>
  );
}

/* ---------- 3D 倾斜卡片 ---------- */
function TiltCard({ children, glow, className = '' }) {
  const ref = useRef(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 160, damping: 16 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-8, 8]), { stiffness: 160, damping: 16 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        mx.set((e.clientX - rect.left) / rect.width);
        my.set((e.clientY - rect.top) / rect.height);
      }}
      onMouseLeave={() => { mx.set(0.5); my.set(0.5); }}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      className={className}
    >
      {children}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{ background: `radial-gradient(380px circle at 50% 50%, ${glow}, transparent 70%)` }}
      />
    </motion.div>
  );
}

/* ---------- 第一部分：Apertus 1.5 多模态能力 ---------- */
const modalityCards = [
  {
    icon: Eye,
    title: '视觉理解',
    desc: '图片、文档、图表、场景画面联合输入，支持目标检测、姿态识别、场景理解、OCR 文字识别与图表数据解读，可多图对比、长文档图文混读。',
    accent: 'from-teal-400 to-emerald-500',
    glow: 'rgba(20,184,166,0.18)',
  },
  {
    icon: Mic,
    title: '音频语音',
    desc: '原生语音识别、语音语义理解与声纹特征识别，支持多语种、多方言口语转写与意图理解，兼容环境音事件识别与分类。',
    accent: 'from-violet-400 to-indigo-500',
    glow: 'rgba(139,92,246,0.18)',
  },
  {
    icon: Brain,
    title: '文本推理 · Thinking Mode',
    desc: '长文本生成、摘要、推理与代码生成，内置思考模式可输出完整推理链路，护理研判过程透明可追溯。',
    accent: 'from-cyan-400 to-blue-500',
    glow: 'rgba(34,211,238,0.18)',
  },
  {
    icon: Wrench,
    title: '工具调用 · 硬件联动',
    desc: '增强版工具调用能力，可联动外部硬件、传感器与数据库执行指令，直接驱动机器人告警、通话、日程等实际动作。',
    accent: 'from-amber-400 to-orange-500',
    glow: 'rgba(251,191,36,0.18)',
  },
];

/* ---------- 核心基础参数 ---------- */
const coreSpecs = [
  { icon: Layers, label: '架构类型', value: 'Decoder-only', desc: '纯解码器 Transformer' },
  { icon: Cpu, label: '模型版本', value: '8B / 70B', desc: '另有 0.5B / 1.5B / 4B 边缘版' },
  { icon: Database, label: '预训练数据', value: '15 万亿', desc: 'Tokens · 40% 非英语语料' },
  { icon: Globe2, label: '原生语言', value: '1800+', desc: '含瑞士德语、罗曼什语等低资源方言' },
  { icon: FileText, label: '上下文窗口', value: '262,144', desc: 'Tokens · 约 20 万字中文，较 1.0 提升 4 倍' },
  { icon: Zap, label: '训练算力', value: '2000 万+', desc: 'GPU 小时/年 · 瑞士 Alps 超级计算机' },
  { icon: Sparkles, label: '自研技术', value: 'xIELU', desc: '激活函数 · AdEMAMix 优化器 · QRPO 对齐' },
  { icon: InfinityIcon, label: '量化部署', value: 'BF16 → INT3', desc: 'BF16 / FP8 / INT4 / INT3 多精度' },
];

/* ---------- 在森卫安护中的四大落地任务 ---------- */
const landingTasks = [
  {
    icon: Eye,
    title: '视觉感知 · 跌倒秒级告警',
    desc: '接入机器人摄像头画面，实时识别老人跌倒、摔倒、久坐不起等异常姿态，即刻触发声光告警与家属/护工通知。',
    accent: 'from-cyan-400 to-blue-500',
    tags: ['姿态识别', '场景理解', '实时告警'],
  },
  {
    icon: MessageSquare,
    title: '语音交互 · 带口音也听得懂',
    desc: '听懂老人自然口语指令，完成陪护对话、用药提醒、日程播报，1800+ 语言与方言能力覆盖带口音的日常用语。',
    accent: 'from-violet-400 to-indigo-500',
    tags: ['方言口语', '用药提醒', '情感陪护'],
  },
  {
    icon: Heart,
    title: '健康数据分析 · SenHu Ultra 1',
    desc: '接入森狐 Ultra 1 腕表的心率、血氧、体温、睡眠数据，结合 262K 长上下文一次性载入全天数据，端侧生成每日健康简报与风险提示。',
    accent: 'from-rose-400 to-pink-500',
    tags: ['心率血氧', '睡眠分析', '每日简报'],
  },
  {
    icon: Lock,
    title: '隐私保障 · 8B 本地推理',
    desc: '采用 8B 轻量化量化版本地推理，老人健康数据、画面与语音均不离开设备端，无需云端回传，符合养老隐私合规要求。',
    accent: 'from-teal-400 to-emerald-500',
    tags: ['INT4 量化', '数据不出端', '断网可用'],
  },
];

/* ---------- 第三部分：B/C/G 差异化部署 ---------- */
const deployments = [
  {
    tag: 'B 端',
    code: 'BUSINESS',
    model: 'Apertus 1.5 · 70B',
    title: '养老机构 · 机构本地高性能推理',
    icon: Building2,
    accent: { from: 'from-blue-500', to: 'to-cyan-400', text: 'text-cyan-300', bg: 'bg-blue-500/15', border: 'border-blue-400/40', glow: 'rgba(59,130,246,0.18)' },
    desc: '面向养老院、护理院、CCRC 社区与康复医院，70B 通用高性能版本署于机构本地算力节点，支撑全院并发巡护、多机协同与护理看板分析。',
    points: [
      '70B 通用高性能版本地部署',
      '整院多机并发巡护与跌倒告警',
      '长档案 + 全天传感器数据一次载入',
      '与机构信息系统无缝对接',
    ],
    image: `${import.meta.env.BASE_URL}images/apertus-b2b.jpg`,
  },
  {
    tag: 'C 端',
    code: 'CONSUMER',
    model: 'Apertus 1.5 · 8B',
    title: '家庭用户 · 8B 量化端侧陪护',
    icon: Home,
    accent: { from: 'from-teal-500', to: 'to-emerald-400', text: 'text-emerald-300', bg: 'bg-teal-500/15', border: 'border-teal-400/40', glow: 'rgba(20,184,166,0.18)' },
    desc: '面向独居老人、空巢家庭与异地子女家庭，8B 端侧优化版以 INT4/INT3 量化在机器人本地运行，强调隐私、低联网依赖与日常陪伴。',
    points: [
      '8B 端侧优化 · INT4/INT3 量化',
      '居家跌倒本地监测与告警',
      '一键紧急呼叫子女',
      '影像语音不出户，断网仍可用',
    ],
    image: `${import.meta.env.BASE_URL}images/apertus-c2c.jpg`,
  },
  {
    tag: 'G 端',
    code: 'GOVERNMENT',
    model: '70B 区域中心 + 4B 边缘',
    title: '民政公益 · 云端与边缘协同',
    icon: Landmark,
    accent: { from: 'from-indigo-500', to: 'to-purple-500', text: 'text-indigo-300', bg: 'bg-indigo-500/15', border: 'border-indigo-400/40', glow: 'rgba(99,102,241,0.18)' },
    desc: '面向民政部门、街道社区、养老服务中心与公益项目，区域中心部署 70B 承担跨场景研判与政策宣讲，社区驿站以 4B 边缘版值守，数据留痕对接监管平台。',
    points: [
      '70B 区域中心风险分级研判',
      '4B 边缘版驿站本地值守',
      '惠民政策智能宣讲',
      '脱敏数据留痕对接监管平台',
    ],
    image: `${import.meta.env.BASE_URL}images/apertus-g2c.jpg`,
  },
];

/* ---------- 底部对比表 ---------- */
const compareRows = [
  {
    client: 'B 端养老机构',
    model: 'Apertus 1.5 · 70B',
    position: '机构本地高性能推理',
    ability: '全院巡护 · 跌倒识别 · 多机协同 · 系统对接',
    scene: '养老院 · 护理院 · CCRC 社区',
    accent: 'text-cyan-300',
  },
  {
    client: 'C 端家庭用户',
    model: 'Apertus 1.5 · 8B',
    position: '端侧量化隐私陪护',
    ability: '日常陪伴 · 居家跌倒监测 · 紧急呼叫',
    scene: '独居老人 · 空巢家庭',
    accent: 'text-emerald-300',
  },
  {
    client: 'G 端民政公益',
    model: '70B + 4B 协同',
    position: '区域研判与边缘值守',
    ability: '社区巡访 · 政策宣讲 · 风险分级 · 数据上报',
    scene: '街道社区 · 养老服务中心',
    accent: 'text-indigo-300',
  },
];

/* ---------- 开源与合规 ---------- */
const complianceCards = [
  {
    icon: ScrollText,
    title: 'Apache 2.0 全开源',
    desc: '训练代码、模型权重、数据配方全部公开，允许商业使用、修改与二次分发，无营收门槛限制。',
  },
  {
    icon: Shield,
    title: '欧盟合规就绪',
    desc: '符合欧盟《AI 法案》要求，满足瑞士联邦数据保护法（FDPA）标准，医疗、养老等强隐私场景可直接落地。',
  },
  {
    icon: Eye,
    title: '全流程可审计',
    desc: '训练数据集、训练流程、模型权重、推理代码全部公开可审计，Thinking Mode 让护理研判链路透明可见。',
  },
  {
    icon: Cpu,
    title: '边缘离线运行',
    desc: '0.5B / 1.5B / 4B 轻量版可在边缘设备本地运行，支持 BF16/FP8/INT4/INT3 多精度，无需云端回传。',
  },
];

export default function ApertusBrain() {
  const navigate = useNavigate();
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll();
  const progressScale = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(heroProgress, [0, 1], [0, 160]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.15]);
  const heroOpacity = useTransform(heroProgress, [0, 0.75], [1, 0]);
  const bgY = useTransform(heroProgress, [0, 1], [0, 120]);

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/');
  };

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') handleBack(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="page-enter bg-[#05070f] text-white min-h-screen overflow-x-hidden"
    >
      {/* 顶部滚动进度条 */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-400 via-teal-400 to-amber-400 origin-left z-[60]"
        style={{ scaleX: progressScale }}
      />

      {/* 固定返回按钮 */}
      <motion.button
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        onClick={handleBack}
        className="fixed top-5 left-5 z-50 group flex items-center gap-2.5 bg-black/55 backdrop-blur-xl border border-white/15 hover:border-cyan-400/60 rounded-full pl-3 pr-5 py-2.5 text-xs font-medium text-white/85 hover:text-cyan-200 transition-all duration-300 hover:shadow-[0_0_28px_rgba(34,211,238,0.35)]"
      >
        <span className="w-6 h-6 rounded-full bg-white/10 group-hover:bg-cyan-400/25 flex items-center justify-center transition-all duration-300 group-hover:-translate-x-0.5">
          <ArrowLeft size={13} />
        </span>
        返回
        <kbd className="hidden sm:inline-flex items-center text-[9px] text-white/35 border border-white/15 rounded px-1.5 py-0.5 ml-1">ESC</kbd>
      </motion.button>

      {/* ================= Hero ================= */}
      <section ref={heroRef} className="relative h-screen min-h-[700px] overflow-hidden flex items-center justify-center">
        <motion.div style={{ y: bgY, scale: heroScale }} className="absolute inset-0 z-0">
          <img
            src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=swiss%20alps%20supercomputer%20data%20center%20glowing%20multimodal%20AI%20neural%20core%20streams%20of%20text%20images%20and%20audio%20waveforms%20converging%20cyan%20blue%20purple%20dark%20background%20snowy%20mountain%20silhouette%20cinematic%204k%20technology%20concept%20art&image_size=landscape_16_9"
            alt="Apertus 1.5 多模态大模型 AI 大脑"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(34,211,238,0.35),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_65%,rgba(251,191,36,0.18),transparent_55%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#05070f]/70 via-[#05070f]/55 to-[#05070f]" />
        </motion.div>

        {/* 网格底纹 */}
        <div
          className="absolute inset-0 z-[1] opacity-[0.1] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(34,211,238,0.45) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.45) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />

        {/* 浮动粒子 */}
        <div className="absolute inset-0 z-[2] pointer-events-none">
          {Array.from({ length: 28 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 53) % 100}%`,
                backgroundColor: i % 3 === 0 ? '#fbbf24' : i % 3 === 1 ? '#22d3ee' : '#a5b4fc',
              }}
              animate={{ y: [0, -50, 0], opacity: [0.1, 0.75, 0.1] }}
              transition={{ duration: 4 + (i % 5), repeat: Infinity, delay: (i % 7) * 0.35, ease: 'easeInOut' }}
            />
          ))}
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 px-4 text-center max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex flex-wrap items-center justify-center gap-3 mb-7"
          >
            <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-[0_0_30px_rgba(34,211,238,0.5)]">
              <Brain size={15} />
              AI 大脑
            </span>
            <span className="bg-white/10 backdrop-blur-md border border-white/25 text-white/90 text-xs font-semibold tracking-[0.3em] px-5 py-2 rounded-full">
              APERTUS 1.5
            </span>
            <span className="inline-flex items-center gap-1.5 bg-amber-400/15 border border-amber-400/40 text-amber-200 text-xs font-bold px-4 py-2 rounded-full">
              <ScrollText size={13} />
              Apache 2.0 全开源
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.12 }}
            className="font-display text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.15] mb-5"
          >
            Apertus 1.5 多模态大模型
            <br />
            <span className="bg-gradient-to-r from-cyan-300 via-teal-300 to-amber-300 bg-clip-text text-transparent">
              森卫安护的 AI 大脑内核
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.24 }}
            className="text-sm md:text-base text-white/70 max-w-3xl mx-auto leading-relaxed mb-4"
          >
            瑞士 AI 倡议（Swiss AI Initiative）出品，由 ETH 苏黎世联邦理工、EPFL 洛桑联邦理工、CSCS 瑞士国家超算中心联合研发，
            2026 年 7 月 24 日发布。15 万亿 Tokens 预训练、1800+ 语言原生支持，
            与 AegisEdge Ai5 端侧芯片协同，支撑 B/C/G 三类客户差异化部署。
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xs text-white/45 max-w-3xl mx-auto tracking-wide mb-8"
          >
            Decoder-only Transformer · xIELU 激活 · AdEMAMix 优化器 · QRPO 对齐 · 262,144 Tokens 上下文
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.36 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-9"
          >
            {[
              { icon: FileText, label: '文本' },
              { icon: Eye, label: '图像' },
              { icon: Mic, label: '音频' },
              { icon: Wrench, label: '工具调用' },
            ].map((m, i) => {
              const Icon = m.icon;
              return (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  className="inline-flex items-center gap-2 bg-white/[0.06] backdrop-blur-xl border border-cyan-400/30 rounded-full px-4 py-2.5"
                >
                  <Icon size={15} className="text-cyan-300" />
                  <span className="text-xs font-semibold text-white/85">{m.label}</span>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.48 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#part1"
              className="group inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-sm font-semibold text-black shadow-[0_10px_40px_-8px_rgba(34,211,238,0.6)] hover:-translate-y-0.5 transition-all duration-300"
            >
              探索 AI 大脑架构
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#deploy"
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-amber-400/50 hover:border-amber-400 hover:bg-amber-400/10 rounded-full text-sm font-medium text-amber-100 transition-all duration-300"
            >
              查看 B/C/G 部署方案
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
            <motion.div
              className="w-1 h-2 bg-cyan-300 rounded-full"
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* ================= 核心基础参数 ================= */}
      <section className="relative py-20 md:py-28 bg-gradient-to-b from-[#05070f] to-[#07121a] overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p className="text-xs font-semibold tracking-[0.4em] text-cyan-400 uppercase mb-4">
              Core Specs · 核心基础参数
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
              瑞士造，<span className="bg-gradient-to-r from-cyan-300 to-teal-400 bg-clip-text text-transparent">全面开源的多模态基座</span>
            </h2>
            <p className="text-sm text-white/55 max-w-2xl mx-auto leading-relaxed">
              8B / 70B 双主力版本，另有 0.5B / 1.5B / 4B 边缘轻量化版本，基于瑞士 Alps 超级计算机超 2000 万 GPU 小时/年算力训练。
            </p>
            <div className="section-divider" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {coreSpecs.map((spec, i) => {
              const Icon = spec.icon;
              return (
                <motion.div
                  key={spec.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  whileHover={{ y: -8 }}
                  className="group relative bg-white/[0.04] backdrop-blur-xl border border-white/10 hover:border-cyan-400/50 rounded-2xl p-6 transition-all duration-300"
                >
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-white/15 flex items-center justify-center mb-4">
                    <Icon size={18} className="text-cyan-300" />
                  </div>
                  <p className="text-[11px] text-white/45 mb-1.5 tracking-wider">{spec.label}</p>
                  <p className="font-display text-xl md:text-2xl font-black bg-gradient-to-r from-cyan-300 to-amber-300 bg-clip-text text-transparent mb-1.5">
                    {spec.value}
                  </p>
                  <p className="text-[11px] text-white/50 leading-relaxed">{spec.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= Part 1: 原生多模态 ================= */}
      <section id="part1" className="relative py-20 md:py-28 bg-gradient-to-b from-[#07121a] via-[#07121a] to-[#05070f] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] h-[420px] bg-cyan-600/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-xs font-semibold tracking-[0.4em] text-cyan-400 uppercase mb-4">
              Part 01 · Native Multimodal
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-5">
              Apertus 1.5：<span className="bg-gradient-to-r from-cyan-300 to-teal-400 bg-clip-text text-transparent">原生多模态大模型</span>
            </h2>
            <p className="text-sm md:text-base text-white/62 max-w-3xl mx-auto leading-relaxed">
              Apertus 1.5 为原生多模态模型，支持文本、图像、音频三类输入联合推理。
              作为森卫安护人形机器人的认知内核，它在统一表征空间内融合三类模态输入，
              输出可执行的陪护动作、风险告警与对话回应。
            </p>
          </motion.div>

          {/* 模态融合概念图 + 介绍 */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16">
            <TiltCard glow="rgba(34,211,238,0.18)" className="relative rounded-3xl overflow-hidden group/img">
              <div className="relative aspect-[16/10] rounded-3xl border border-white/10 overflow-hidden">
                <img
                  src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=abstract%20swiss%20engineered%20multimodal%20AI%20model%20fusion%20diagram%20text%20documents%20camera%20images%20audio%20waveforms%20converging%20into%20central%20neural%20core%20glowing%20cyan%20teal%20gold%20streams%20dark%20tech%20background%20cinematic%204k%20concept&image_size=landscape_16_9"
                  alt="Apertus 1.5 模态融合示意图"
                  className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover/img:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070f]/80 via-transparent to-transparent" />
                <div className="absolute top-5 left-5 flex items-center gap-2 bg-black/50 backdrop-blur-md border border-white/15 rounded-full px-3.5 py-1.5">
                  <Sparkles size={13} className="text-amber-300" />
                  <span className="text-[11px] font-semibold text-white/85">三模态联合推理空间</span>
                </div>
              </div>
            </TiltCard>

            <div>
              <div className="flex items-center gap-3 mb-5">
                <Brain size={22} className="text-cyan-300" />
                <p className="text-xs font-semibold tracking-[0.3em] text-cyan-400 uppercase">Three Modalities</p>
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-bold mb-4">文本、图像、音频，一个认知内核</h3>
              <p className="text-sm text-white/62 leading-[1.9] mb-6">
                Apertus 1.5 打破单模态边界，将老人的语音、摄像头画面、健康档案与传感器数据统一编码为同一表征空间，
                让机器人像真人护工一样「听其言、观其行、知其情」；262,144 Tokens 长上下文支持整份健康档案、
                全天传感器数据与多轮对话历史一次性载入，信息不丢失。
              </p>
              <div className="flex flex-wrap gap-2">
                {['文本', '图像', '音频', '工具调用', 'Thinking Mode', '262K 长上下文'].map((t, i) => (
                  <motion.span
                    key={t}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="text-[11px] font-semibold bg-cyan-500/10 border border-cyan-400/30 text-cyan-200 rounded-full px-3.5 py-1.5"
                  >
                    {t}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>

          {/* 四大能力卡片 */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {modalityCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group relative bg-white/[0.04] backdrop-blur-xl border border-white/10 hover:border-cyan-400/50 rounded-2xl p-6 md:p-7 overflow-hidden transition-all duration-300"
                >
                  <div className={`absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.accent} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-lg`}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <h3 className="font-display text-lg font-bold mb-2">{card.title}</h3>
                  <p className="text-xs text-white/55 leading-relaxed">{card.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= Part 2: Apertus 1.5 × AegisEdge Ai5 协同架构 ================= */}
      <section className="relative py-20 md:py-28 bg-[#05070f] overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-xs font-semibold tracking-[0.4em] text-amber-400 uppercase mb-4">
              Part 02 · Edge Synergy
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-5">
              Apertus 1.5 <span className="text-amber-300">×</span> AegisEdge Ai5
              <br />
              <span className="bg-gradient-to-r from-cyan-300 to-amber-300 bg-clip-text text-transparent">端侧养老 AI 架构</span>
            </h2>
            <p className="text-sm md:text-base text-white/62 max-w-3xl mx-auto leading-relaxed">
              Apertus 1.5 负责多模态理解与智能决策，AegisEdge Ai5 负责端侧算力调度与安全可靠执行。
              8B 量化模型在机器人本地运行，实现「认知—决策—执行」毫秒级闭环。
            </p>
          </motion.div>

          {/* 分层架构图 */}
          <div className="relative bg-gradient-to-br from-white/[0.04] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden">
            {/* 背景网格 */}
            <div
              className="absolute inset-0 opacity-[0.06] pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(34,211,238,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.5) 1px, transparent 1px)',
                backgroundSize: '48px 48px',
              }}
            />

            {/* 上层：Apertus 1.5 认知层 */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative z-10 bg-gradient-to-r from-cyan-500/15 to-blue-500/10 border border-cyan-400/40 rounded-2xl p-6 md:p-8 mb-6"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.4)]">
                  <Brain size={30} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black tracking-[0.25em] text-cyan-300">COGNITIVE LAYER</span>
                    <span className="text-[10px] bg-cyan-400/20 text-cyan-200 px-2 py-0.5 rounded-full">认知层</span>
                  </div>
                  <h3 className="font-display text-xl md:text-2xl font-bold mb-1">Apertus 1.5 认知层</h3>
                  <p className="text-xs text-white/60">多模态理解 · Thinking Mode 推理 · 对话生成 · 风险研判 · 工具调用</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['文本', '图像', '音频', '8B 量化', '262K'].map((t) => (
                    <span key={t} className="text-[10px] bg-cyan-400/15 border border-cyan-400/30 text-cyan-200 rounded-full px-2.5 py-1">{t}</span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* 中间：发光协同连线 */}
            <div className="relative z-10 flex items-center justify-center my-2">
              <div className="flex flex-col items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-0.5 h-3 rounded-full bg-gradient-to-b from-cyan-400 to-amber-400"
                    animate={{ opacity: [0.2, 1, 0.2], scaleY: [0.6, 1.2, 0.6] }}
                    transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
                  />
                ))}
                <div className="flex items-center gap-2 my-1">
                  <motion.span
                    animate={{ boxShadow: ['0 0 12px rgba(34,211,238,0.5)', '0 0 24px rgba(251,191,36,0.7)', '0 0 12px rgba(34,211,238,0.5)'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-amber-500/20 border border-white/20 text-[10px] font-semibold text-white/80 whitespace-nowrap"
                  >
                    协同推理总线 · 本地闭环
                  </motion.span>
                </div>
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-0.5 h-3 rounded-full bg-gradient-to-b from-amber-400 to-indigo-400"
                    animate={{ opacity: [0.2, 1, 0.2], scaleY: [0.6, 1.2, 0.6] }}
                    transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.15 + 0.1, ease: 'easeInOut' }}
                  />
                ))}
              </div>
            </div>

            {/* 下层：AegisEdge Ai5 芯片层 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative z-10 bg-gradient-to-r from-indigo-500/15 to-purple-500/10 border border-indigo-400/40 rounded-2xl p-6 md:p-8"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.4)]">
                  <Cpu size={30} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black tracking-[0.25em] text-indigo-300">EDGE CHIP LAYER</span>
                    <span className="text-[10px] bg-indigo-400/20 text-indigo-200 px-2 py-0.5 rounded-full">芯片层</span>
                  </div>
                  <h3 className="font-display text-xl md:text-2xl font-bold mb-1">AegisEdge Ai5 边缘芯片层</h3>
                  <p className="text-xs text-white/60">算力调度 · 安全隔离 · 传感融合 · 执行控制</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['NPU', 'HBM', '安全飞地', '传感融合'].map((t) => (
                    <span key={t} className="text-[10px] bg-indigo-400/15 border border-indigo-400/30 text-indigo-200 rounded-full px-2.5 py-1">{t}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* 协同价值三卡 */}
          <div className="grid md:grid-cols-3 gap-4 mt-10">
            {[
              { icon: Zap, title: '实时闭环', desc: '8B 量化模型端侧推理，认知到执行实时响应老人需求与险情', color: 'text-amber-300' },
              { icon: Lock, title: '端侧隐私', desc: '健康数据、画面语音本地处理，无需云端回传，符合养老隐私合规', color: 'text-cyan-300' },
              { icon: Shield, title: '安全可审计', desc: '开源权重与 Thinking Mode 推理链路全程透明，Ai5 安全飞地隔离决策', color: 'text-indigo-300' },
            ].map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/[0.03] border border-white/10 hover:border-white/25 rounded-2xl p-6 transition-all duration-300"
                >
                  <Icon size={22} className={`${v.color} mb-3`} />
                  <h4 className="font-bold mb-1.5">{v.title}</h4>
                  <p className="text-xs text-white/55 leading-relaxed">{v.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= 在森卫安护中的落地适配 ================= */}
      <section className="relative py-20 md:py-28 bg-gradient-to-b from-[#05070f] via-[#07121a] to-[#05070f] overflow-hidden">
        <div className="absolute top-1/4 -right-40 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 -left-40 w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-xs font-semibold tracking-[0.4em] text-rose-400 uppercase mb-4">
              Landing · 森卫安护落地适配
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-5">
              Apertus 1.5 在守护场景中的 <span className="bg-gradient-to-r from-rose-300 to-teal-300 bg-clip-text text-transparent">四大任务</span>
            </h2>
            <p className="text-sm md:text-base text-white/62 max-w-3xl mx-auto">
              本项目采用 Apertus 1.5 多模态模型作为核心 AI 引擎，对接 AegisEdge Ai5 端侧芯片，承担从感知到隐私的完整守护链路。
            </p>
            <div className="section-divider" />
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
            {landingTasks.map((task, i) => {
              const Icon = task.icon;
              return (
                <motion.div
                  key={task.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group relative bg-white/[0.04] backdrop-blur-xl border border-white/10 hover:border-white/30 rounded-2xl p-7 md:p-8 transition-all duration-300 overflow-hidden"
                >
                  <div className="flex items-start gap-5 mb-5">
                    <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${task.accent} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                      <Icon size={26} className="text-white" />
                    </div>
                    <h3 className="font-display text-lg md:text-xl font-bold leading-snug pt-2">{task.title}</h3>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed mb-5">{task.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((t) => (
                      <span key={t} className="text-[10px] font-semibold bg-white/[0.06] border border-white/15 text-white/70 rounded-full px-3 py-1.5">
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= Part 3: B/C/G 差异化部署 ================= */}
      <section id="deploy" className="relative py-20 md:py-28 bg-[#05070f] overflow-hidden">
        <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-40 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-xs font-semibold tracking-[0.4em] text-teal-400 uppercase mb-4">
              Part 03 · Differentiated Deployment
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-5">
              面向三类客户的 <span className="bg-gradient-to-r from-cyan-300 to-emerald-400 bg-clip-text text-transparent">差异化模型部署</span>
            </h2>
            <p className="text-sm md:text-base text-white/62 max-w-2xl mx-auto">
              根据客户场景算力与隐私需求，森卫安护提供 8B 端侧量化、70B 本地高性能与「70B + 4B」云边协同三档 Apertus 1.5 方案。
            </p>
          </motion.div>

          <div className="space-y-8 md:space-y-10">
            {deployments.map((dep, idx) => {
              const Icon = dep.icon;
              const reverse = idx % 2 === 1;
              return (
                <motion.div
                  key={dep.code}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                  className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center ${reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}
                >
                  <TiltCard glow={dep.accent.glow} className="relative rounded-3xl overflow-hidden group/card">
                    <div className="relative aspect-[16/10] rounded-3xl border border-white/10 overflow-hidden">
                      <img
                        src={dep.image}
                        alt={dep.title}
                        className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover/card:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#05070f] via-transparent to-transparent" />
                      <div className="absolute inset-0 -translate-x-full group-hover/card:translate-x-full transition-transform duration-[1.4s] bg-gradient-to-r from-transparent via-white/12 to-transparent" />
                      <div className="absolute top-5 left-5 flex items-center gap-2">
                        <span className={`${dep.accent.bg} ${dep.accent.text} text-xs font-bold px-3 py-1.5 rounded-full`}>{dep.tag}</span>
                        <span className="bg-black/50 backdrop-blur text-white/80 text-[10px] font-semibold tracking-widest px-2.5 py-1.5 rounded-full">{dep.code}</span>
                      </div>
                      <motion.div
                        whileHover={{ rotate: 8, scale: 1.08 }}
                        className={`absolute bottom-5 left-5 w-14 h-14 rounded-2xl bg-gradient-to-br ${dep.accent.from} ${dep.accent.to} flex items-center justify-center shadow-2xl`}
                      >
                        <Icon size={26} className="text-white" />
                      </motion.div>
                    </div>
                  </TiltCard>

                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`font-display text-sm font-black tracking-widest ${dep.accent.text}`}>{dep.model}</span>
                      <span className="h-px flex-1 bg-gradient-to-r from-white/25 to-transparent" />
                    </div>
                    <h3 className="font-display text-2xl md:text-3xl font-bold mb-3 leading-tight">{dep.title}</h3>
                    <p className="text-sm text-white/62 leading-[1.9] mb-6">{dep.desc}</p>

                    <ul className="grid sm:grid-cols-2 gap-2.5 mb-6">
                      {dep.points.map((p, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -16 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.15 + i * 0.08 }}
                          className={`flex items-center gap-2.5 text-xs text-white/75 bg-white/[0.04] border ${dep.accent.border} rounded-xl px-3.5 py-2.5 hover:bg-white/[0.07] transition-all duration-300`}
                        >
                          <span className={`flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br ${dep.accent.from} ${dep.accent.to} flex items-center justify-center`}>
                            <Check size={11} className="text-white" strokeWidth={3} />
                          </span>
                          {p}
                        </motion.li>
                      ))}
                    </ul>

                    <Link
                      to={dep.code === 'BUSINESS' ? '/b2b-eldercare' : dep.code === 'CONSUMER' ? '/c2c-family' : '/g2c-government'}
                      className={`inline-flex items-center gap-2 text-sm font-semibold ${dep.accent.text} group/link`}
                    >
                      <span className="bg-gradient-to-r from-current to-current bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover/link:bg-[length:100%_2px] pb-0.5">
                        查看{dep.tag}完整方案
                      </span>
                      <ArrowRight size={15} className="group-hover/link:translate-x-1.5 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= Part 4: 对比表 + 关键指标 ================= */}
      <section className="relative py-20 md:py-28 bg-gradient-to-b from-[#05070f] via-[#07121a] to-[#05070f] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.12),transparent_55%)] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="text-xs font-semibold tracking-[0.4em] text-amber-400 uppercase mb-4">
              Comparison · 部署对比
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
              森卫安护 Apertus 1.5 <span className="bg-gradient-to-r from-cyan-300 to-amber-300 bg-clip-text text-transparent">模型部署对比</span>
            </h2>
            <p className="text-sm text-white/55">按客户类型匹配模型规格，精准匹配场景算力与隐私需求</p>
          </motion.div>

          {/* 表格 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl"
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/[0.05] border-b border-white/10">
                  {['客户类型', '模型版本', '核心定位', '重点能力', '典型场景'].map((h) => (
                    <th key={h} className="text-left px-5 py-4 text-xs font-bold tracking-wider text-cyan-300 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row) => (
                  <motion.tr
                    key={row.client}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 }}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.04] transition-colors"
                  >
                    <td className="px-5 py-4">
                      <span className={`font-bold ${row.accent}`}>{row.client}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center bg-white/[0.06] border border-white/15 rounded-full px-2.5 py-1 text-xs font-mono whitespace-nowrap">
                        {row.model}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-white/80">{row.position}</td>
                    <td className="px-5 py-4 text-white/60 text-xs leading-relaxed max-w-[220px]">{row.ability}</td>
                    <td className="px-5 py-4 text-white/60 text-xs">{row.scene}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          {/* 关键指标 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            {[
              { icon: Database, custom: <CountUp to={15} suffix=" 万亿" />, label: '预训练 Tokens', desc: '40% 非英语语料' },
              { icon: Globe2, custom: <CountUp to={1800} suffix="+" />, label: '原生支持语言', desc: '覆盖低资源方言' },
              { icon: FileText, custom: <CountUp to={262} suffix="K" />, label: '上下文窗口', desc: '约 20 万字中文' },
              { icon: ScrollText, custom: <>100<em className="not-italic">%</em></>, label: 'Apache 2.0 开源', desc: '权重代码数据全公开' },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group bg-white/[0.04] border border-white/10 hover:border-cyan-400/50 rounded-2xl p-6 text-center transition-all duration-300"
                >
                  <Icon size={22} className="text-amber-300 mx-auto mb-3" />
                  <p className="font-display text-3xl md:text-4xl font-black bg-gradient-to-r from-cyan-300 to-amber-300 bg-clip-text text-transparent mb-1 tabular-nums">
                    {s.custom}
                  </p>
                  <p className="text-sm font-semibold text-white/85">{s.label}</p>
                  <p className="text-[11px] text-white/40">{s.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= 开源与合规 ================= */}
      <section className="relative py-20 md:py-28 bg-[#05070f] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] h-[420px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p className="text-xs font-semibold tracking-[0.4em] text-amber-400 uppercase mb-4">
              Open Source & Compliance · 开源合规
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
              完全开源，<span className="bg-gradient-to-r from-amber-300 to-cyan-300 bg-clip-text text-transparent">为强隐私场景而生</span>
            </h2>
            <div className="section-divider" />
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {complianceCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  whileHover={{ y: -8 }}
                  className="group bg-white/[0.04] backdrop-blur-xl border border-amber-400/20 hover:border-amber-400/50 rounded-2xl p-6 md:p-7 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400/20 to-cyan-500/20 border border-white/15 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <Icon size={22} className="text-amber-300" />
                  </div>
                  <h3 className="font-display text-base md:text-lg font-bold mb-2">{card.title}</h3>
                  <p className="text-xs text-white/55 leading-relaxed">{card.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="relative py-20 md:py-24 bg-[#05070f] overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[340px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-cyan-600/20 via-[#07121a] to-amber-600/15 p-10 md:p-14 text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-24 -right-24 w-64 h-64 border border-cyan-400/15 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="absolute -bottom-28 -left-28 w-72 h-72 border border-amber-400/15 rounded-full"
            />

            <Brain size={32} className="text-cyan-300 mx-auto mb-5" />
            <h3 className="font-display text-2xl md:text-3xl font-bold mb-3">
              为你的场景，匹配最合适的 AI 大脑
            </h3>
            <p className="text-sm text-white/60 max-w-xl mx-auto mb-8 leading-relaxed">
              无论是机构、家庭还是民政公益，森卫安护都能基于 Apertus 1.5 与 AegisEdge Ai5 提供端到端养老 AI 方案——开源、合规、数据不出端。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Link
                to="/products"
                className="group inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-sm font-semibold text-black shadow-[0_10px_40px_-8px_rgba(34,211,238,0.6)] hover:-translate-y-0.5 transition-all duration-300"
              >
                探索守护方案
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/30 hover:border-cyan-400/60 hover:bg-white/5 rounded-full text-sm font-medium transition-all duration-300"
              >
                <ArrowLeft size={15} />
                返回上一页
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </motion.div>
  );
}
