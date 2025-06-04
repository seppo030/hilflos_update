import React, { useState } from 'react';
import './style.css';

const AMOUNTS = { light:252, medium:630, severe:1008 };

const steps = [
  {
    id:'resident',
    title:'Wohnsitz',
    question:'Lebst du seit mindestens 6 Monaten dauerhaft in der Schweiz?',
    options:[{label:'Ja', value:'yes'},{label:'Nein', value:'no', red:true}]
  },
  {
    id:'ahv',
    title:'AHV‑Rente',
    question:'Beziehst du eine AHV‑Altersrente oder Ergänzungsleistungen?',
    options:[{label:'Ja', value:'yes'},{label:'Nein', value:'no', red:true}]
  },
  {
    id:'help',
    title:'Dauer der Hilflosigkeit',
    question:'Benötigst du seit mindestens 6 Monaten regelmässig Hilfe im Alltag?',
    options:[{label:'Ja', value:'yes'},{label:'Nein', value:'no', red:true}]
  },
  {
    id:'otherIns',
    title:'Andere Leistungen',
    question:'Erhältst du bereits eine Hilflosen­entschädigung der Unfall‑ oder Militärversicherung?',
    options:[{label:'Nein', value:'no'},{label:'Ja', value:'yes', red:true}]
  },
  {
    id:'living',
    title:'Wohnsituation',
    question:'Wo wohnst du aktuell?',
    options:[{label:'Zuhause', value:'home'},{label:'Heim / Klinik', value:'institution'}]
  },
  {
    id:'grade',
    title:'Schweregrad der Hilflosigkeit',
    question:'Wie wird deine Hilflosigkeit eingestuft?',
    options:[
      {label:'leicht', value:'light'},
      {label:'mittel', value:'medium'},
      {label:'schwer', value:'severe'}
    ]
  }
];

function displayGrade(g){
  return g==='light'?'leicht':g==='medium'?'mittel':'schwer';
}

export default function App(){
  const [stepIndex,setStepIndex]=useState(0);
  const [answers,setAnswers]=useState({});

  const total=steps.length;

  
const handleSelect=(id,value)=>{
    setAnswers(prev=>({...prev,[id]:value}));
    setStepIndex(prev=>prev+1); // immer einen Schritt weiter, auch zum Ergebnis
};

    setAnswers(newAns);
    if(stepIndex<total-1){
      setStepIndex(stepIndex+1);
    }
  };

  const restart=()=>{
    setAnswers({});
    setStepIndex(0);
  };

  const evaluate=()=>{
    const fails=[];
    const passed=[];
    if(answers.resident!=='yes') fails.push('Kein dauerhafter Wohnsitz in der Schweiz');
    else passed.push('Wohnsitz‑Kriterium erfüllt');
    if(answers.ahv!=='yes') fails.push('Keine AHV‑Altersrente oder Ergänzungsleistungen');
    else passed.push('Renten‑Kriterium erfüllt');
    if(answers.help!=='yes') fails.push('Hilflosigkeit besteht nicht seit ≥6 Monaten');
    else passed.push('Dauer‑Kriterium erfüllt');
    if(answers.otherIns!=='no') fails.push('Bereits Hilflosenentschädigung von UV/MV');
    else passed.push('Keine Doppelleistung');
    if(answers.living==='institution' && answers.grade==='light')
      fails.push('Bei leichter Hilflosigkeit im Heim besteht kein Anspruch');

    if(fails.length>0) return {ok:false, reasons:fails};
    const amount=AMOUNTS[answers.grade];
    const explain=[
      `Schweregrad <strong>${displayGrade(answers.grade)}</strong>`,
      `Wohnsituation: <strong>${answers.living==='home'?'Zuhause':'Heim/Klinik'}</strong>`
    ];
    return {ok:true, amount, reasons:explain.concat(passed)};
  };

  const res=evaluate();

  return (
    <div className="funnel">
      <header>
        <h1>Anspruchs­check Hilflosen­entschädigung (AHV)</h1>
        <div className="progress"><div className="bar" style={{width:`${(stepIndex)/total*100}%`}}></div></div>
      </header>

      {stepIndex<total ? (
        <div className="step">
          <h2>{steps[stepIndex].title}</h2>
          <p>{steps[stepIndex].question}</p>
          <div className="options">
            {steps[stepIndex].options.map(opt=>(
              <button key={opt.value}
                className={opt.red?'red':''}
                onClick={()=>handleSelect(steps[stepIndex].id,opt.value)}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ):(
        <div className="step" id="result">
          {res.ok?(
            <div>
              <p className="ok">Voraussichtliche Entschädigung: <strong>CHF {res.amount.toLocaleString('de-CH')}</strong> pro Monat.</p>
              <ul>{res.reasons.map(r=><li key={r} dangerouslySetInnerHTML={{__html:r}} />)}</ul>
              <p><small>*Stand Beträge: 1. Januar 2025. Ergebnis ohne Gewähr.</small></p>
            </div>
          ):(
            <div>
              <p className="fail">Kein Anspruch, weil:</p>
              <ul>{res.reasons.map(r=><li key={r}>{r}</li>)}</ul>
            </div>
          )}
          <button onClick={restart}>Neu starten</button>
        </div>
      )}
    </div>
  );
}
