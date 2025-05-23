
import { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';

const ROLES = [
  "LETS PROVE IT",
  "PROOF VERIFIED",
  "PROOF OF ART/VIDEO/MUSIC/WRITING/DEV",
  "PROVE W/ LUV",
  "PROOFER",
  "PROVER/TRUTH PROVER",
  "CARGO PROVER/PROGRAMMABLE TRUTH",
  "ALL IN SUCCINCT"
];

export default function App() {
  const [form, setForm] = useState({
    discord: '',
    twitter: '',
    custom1: '',
    custom2: '',
    custom3: '',
    stars: '',
    id: generateId(),
    roles: [],
    avatar: null
  });

  const canvasRef = useRef(null);

  function generateId() {
    return String(Math.floor(Math.random() * 90000 + 10000)) + '-' + String(Math.floor(Math.random() * 90 + 10));
  }

  const toggleRole = (role) => {
    setForm(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role]
    }));
  };

  const uploadAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm(prev => ({ ...prev, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const clearSignature = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const handleDownload = () => {
    const node = document.getElementById('card');
    html2canvas(node).then(canvas => {
      const link = document.createElement('a');
      link.download = 'succinct_id.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let drawing = false;

    const startDraw = (e) => {
      drawing = true;
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
    };

    const draw = (e) => {
      if (!drawing) return;
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    const stopDraw = () => {
      drawing = false;
    };

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDraw);
    canvas.addEventListener('mouseout', stopDraw);

    return () => {
      canvas.removeEventListener('mousedown', startDraw);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDraw);
      canvas.removeEventListener('mouseout', stopDraw);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-start p-8 gap-4">
      <div className="relative w-[850px] h-[1200px]" id="card">
        <img src="/card-bg.png" alt="card" className="absolute w-full h-full" />
        <div className="absolute top-[77px] left-[65px] w-[315px] h-[315px] bg-pink-200 rounded-[28px] overflow-hidden">
          {form.avatar && <img src={form.avatar} alt="avatar" className="w-full h-full object-cover" />}
        </div>
        <div className="absolute top-[417px] left-[83px] text-[22px] text-[#a1007e] font-bold tracking-widest">{form.twitter}</div>
        <div className="absolute top-[465px] left-[83px] text-[22px] text-[#a1007e] font-bold tracking-widest">{form.discord}</div>
        <div className="absolute top-[512px] left-[83px] text-[22px] text-[#a1007e] font-bold tracking-widest">{form.custom1}</div>
        <div className="absolute top-[560px] left-[83px] text-[22px] text-[#a1007e] font-bold tracking-widest">{form.custom2}</div>
        <div className="absolute top-[607px] left-[83px] text-[22px] text-[#a1007e] font-bold tracking-widest">{form.custom3}</div>
        <div className="absolute top-[650px] left-[620px] text-[26px] text-[#fe11c5] font-bold tracking-widest">{form.stars}</div>
        <div className="absolute top-[65px] right-[60px] text-[26px] text-white font-bold tracking-widest">{form.id}</div>
        {ROLES.map((role, i) => (
          form.roles.includes(role) && (
            <img
              key={role}
              src="/stamp.png"
              alt="✔"
              className="absolute w-[30px] h-[30px] left-[50px] top-[720px]"
              style={{ top: `${720 + i * 47}px` }}
            />
          )
        ))}
        <canvas
          ref={canvasRef}
          width={230}
          height={75}
          className="absolute left-[75px] top-[1025px] rounded-[12px] bg-white"
        />
      </div>

      <div className="w-full max-w-[850px] grid grid-cols-2 gap-3 bg-white text-black p-4 rounded-xl">
        <input type="file" onChange={uploadAvatar} className="col-span-2" />
        <input placeholder="Twitter" value={form.twitter} onChange={(e) => setForm({ ...form, twitter: e.target.value })} />
        <input placeholder="Discord" value={form.discord} onChange={(e) => setForm({ ...form, discord: e.target.value })} />
        <input placeholder="Custom field 1" value={form.custom1} onChange={(e) => setForm({ ...form, custom1: e.target.value })} />
        <input placeholder="Custom field 2" value={form.custom2} onChange={(e) => setForm({ ...form, custom2: e.target.value })} />
        <input placeholder="Custom field 3" value={form.custom3} onChange={(e) => setForm({ ...form, custom3: e.target.value })} />
        <input placeholder="Stars" value={form.stars} onChange={(e) => setForm({ ...form, stars: e.target.value })} />
        <div className="col-span-2">
          <div className="font-semibold">Roles / Achievements:</div>
          {ROLES.map((role) => (
            <label key={role} className="block text-sm">
              <input type="checkbox" checked={form.roles.includes(role)} onChange={() => toggleRole(role)} className="mr-2" />
              {role}
            </label>
          ))}
        </div>
        <div className="flex gap-4 col-span-2 mt-2">
          <button onClick={clearSignature} className="px-4 py-2 border rounded">Clear Signature</button>
          <button onClick={handleDownload} className="px-4 py-2 bg-pink-500 text-white rounded font-bold">Download PNG</button>
        </div>
      </div>
    </div>
  );
}
