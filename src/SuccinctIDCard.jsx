
import { useState, useRef } from "react";
import html2canvas from "html2canvas";

export default function SuccinctIDCard() {
  const [form, setForm] = useState({
    discord: "",
    twitter: "",
    field1: "",
    field2: "",
    field3: "",
    stars: "",
    proofs: "",
    id: "C" + Math.floor(Math.random() * 90000 + 10000) + "-1",
    achievements: [],
    avatar: null,
  });

  const canvasRef = useRef(null);

  const handleDownload = () => {
    const card = document.getElementById("card");
    html2canvas(card).then((canvas) => {
      const link = document.createElement("a");
      link.download = "succinct_id.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  const toggleAchievement = (label) => {
    setForm((prev) => ({
      ...prev,
      achievements: prev.achievements.includes(label)
        ? prev.achievements.filter((a) => a !== label)
        : [...prev.achievements, label],
    }));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setForm((prev) => ({ ...prev, avatar: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const startDrawing = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "blue";
    let drawing = false;

    const start = (e) => {
      drawing = true;
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
    };

    const draw = (e) => {
      if (!drawing) return;
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
    };

    const stop = () => {
      drawing = false;
      ctx.beginPath();
    };

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stop);
    canvas.addEventListener("mouseleave", stop);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start p-6 w-full max-w-screen-xl">
      <div id="card" className="relative bg-cover bg-center rounded-2xl p-6 w-full max-w-md text-black font-mono shadow-lg" style={{ backgroundImage: "url('/card-bg.png')" }}>
        <img src="/logo.svg" alt="logo" className="absolute top-4 right-4 w-24" />
        <div className="absolute top-4 left-4 bg-white px-2 py-1 rounded text-xs font-bold">SUCCINCT COMMUNITY ID</div>
        <div className="mt-20 grid grid-cols-3 gap-2 items-start">
          <div className="col-span-1">
            {form.avatar && <img src={form.avatar} alt="avatar" className="rounded-xl aspect-square border border-pinkborder" />}
            <div className="mt-2 text-center bg-white text-xs py-1 rounded-md">ID: {form.id}</div>
          </div>
          <div className="col-span-2 text-sm space-y-1 bg-white/80 p-2 rounded-md">
            <div><strong>DISCORD:</strong> {form.discord}</div>
            <div><strong>TWITTER:</strong> {form.twitter}</div>
            <div>{form.field1}</div>
            <div>{form.field2}</div>
            <div>{form.field3}</div>
            <div><strong>Stars:</strong> {form.stars}</div>
            <div><strong>Proofs:</strong> {form.proofs}</div>
          </div>
        </div>
        <div className="text-xs mt-4 italic text-zinc-700 border-t pt-2">
          By signing this card, you become an official Succinct Community member.
        </div>
        <canvas ref={canvasRef} width={150} height={50} className="mt-2 bg-white border border-gray-300 rounded" onMouseDown={startDrawing} />
        <div className="text-[10px] text-center mt-1">HOLDER'S SIGNATURE</div>
      </div>

      <div className="flex flex-col gap-2 w-full max-w-sm">
        <input type="file" onChange={handleAvatarUpload} className="text-xs bg-zinc-800 rounded px-2 py-1" />
        <input placeholder="Discord" onChange={(e) => setForm({ ...form, discord: e.target.value })} className="bg-zinc-800 p-2 rounded" />
        <input placeholder="Twitter" onChange={(e) => setForm({ ...form, twitter: e.target.value })} className="bg-zinc-800 p-2 rounded" />
        <input placeholder="Custom text 1" onChange={(e) => setForm({ ...form, field1: e.target.value })} className="bg-zinc-800 p-2 rounded" />
        <input placeholder="Custom text 2" onChange={(e) => setForm({ ...form, field2: e.target.value })} className="bg-zinc-800 p-2 rounded" />
        <input placeholder="Custom text 3" onChange={(e) => setForm({ ...form, field3: e.target.value })} className="bg-zinc-800 p-2 rounded" />
        <div className="flex gap-2">
          <input placeholder="Stars" onChange={(e) => setForm({ ...form, stars: e.target.value })} className="bg-zinc-800 p-2 rounded w-1/2" />
          <input placeholder="Proofs" onChange={(e) => setForm({ ...form, proofs: e.target.value })} className="bg-zinc-800 p-2 rounded w-1/2" />
        </div>

        <div className="text-sm font-semibold mt-2">Roles / Achievements:</div>
        {[
          "LETS PROVE IT",
          "PROOF VERIFIED",
          "ZK FRENS",
          "GAMEWINNER",
          "PROOF OF ART/VIDEO/MUSIC/WRITING/DEV",
          "PROVE W/ LUV",
          "SP1UP/CARGO PROVER",
          "PROOFER",
        ].map((label) => (
          <label key={label} className="flex items-center gap-2">
            <input type="checkbox" onChange={() => toggleAchievement(label)} />
            {label}
          </label>
        ))}

        <button onClick={handleDownload} className="mt-4 px-4 py-2 bg-pinkdeep text-white rounded font-semibold hover:bg-pinkcard transition">
          Download PNG
        </button>
      </div>
    </div>
  );
}
