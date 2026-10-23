import { STAGES } from "./stages";

// Server-render every piece of copy. The controller only switches visibility.
export function HeroStageContent() {
  return (
    <div className="copy-content">
      <span className="eyebrow">TỪ CHIẾC BỂ TRỐNG</span>
      {STAGES.map((stage, index) => (
        <div key={stage.label} data-stage-copy={index} hidden={index !== 0}>
          {index === 0 ? (
            <h1>{stage.title[0]}<br />{stage.title[1]}</h1>
          ) : (
            <h2 className="hero-heading">{stage.title[0]}<br />{stage.title[1]}</h2>
          )}
          <p className="hero-description">{stage.description}</p>
        </div>
      ))}
    </div>
  );
}
