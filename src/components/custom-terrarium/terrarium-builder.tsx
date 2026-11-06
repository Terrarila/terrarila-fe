"use client";

import Link from "next/link";
import Image from "next/image";
import { presetSelection, sameSelection } from "./design-presets";
import { useState } from "react";
import { useDesignDispatch, useDesignSelector } from "@/store/design-provider";
import { chooseGlassSize, chooseMaterial, applyPreset, changeNote, resetDesign } from "@/store/design-slice";
import type { BuilderCatalog } from "@/lib/builder-catalog";
import { estimateSelection, formatVnd } from "./estimate";
import { DesignRequestForm } from "./design-request-form";
import { MaterialImageDialog, MaterialThumbnail, TerrariumIllustration } from "./terrarium-illustration";
import { selectedGlassSize, isSelected, buildSteps, type MaterialKey, type MaterialOption } from "./material-catalog";
import styles from "./terrarium-builder.module.css";

export function TerrariumBuilder({ contacts, catalog }: { contacts: { label: string; href: string }[]; catalog: BuilderCatalog }) {
  const { selection, note } = useDesignSelector(state => state.design);
  const dispatch = useDesignDispatch();
  const [showForm, setShowForm] = useState(false);
  const estimate = estimateSelection(selection, catalog);
  const steps = buildSteps(catalog);
  const mossMax = steps.find(step => step.key === "moss")?.maxSelections ?? null;
  const [preview, setPreview] = useState<MaterialOption | null>(null);
  const [status, setStatus] = useState("");
  const chosen = steps.flatMap((step) => step.options.filter((option) => isSelected(selection, step.key, option.id)).map((option) => ({ ...option, key: step.key, category: step.title })));
  const materials = chosen.filter((item) => item.key !== "glass");
  const glass = catalog.materials.find(item => item.category === "glass" && item.legacyId === selection.glass);
  const size = selectedGlassSize(selection, catalog);
  const needsSize = !!(glass?.requiresSize || glass?.sizes?.length);
  const sizeReady = !needsSize || (!!size && size.availability !== "unavailable" && glass?.availability !== "unavailable");
  const complete = steps.filter((step) => (step.key !== "glass" || sizeReady) && step.options.some((option) => isSelected(selection, step.key, option.id))).length;

  function choose(key: MaterialKey, id: string) {
    dispatch(chooseMaterial({ key, id, max: steps.find(step => step.key === key)?.maxSelections ?? null, single: steps.find(step => step.key === key)?.selectionMode === "single" }));
    setShowForm(false);
    setStatus("");
  }

  const RequiredField = () => <span className={styles.requiredField}>*</span>;

  return <main className={styles.builder}>
    <aside className={styles.previewPanel} aria-label="Minh hoạ bể của bạn">
      <div className={styles.previewTop}>
        <Link href="/" className={styles.brand} aria-label="Petite Terre — về trang chủ">
          <span className={styles.brandLogo} aria-hidden="true" />Petite Terre
        </Link>
        <Link href="/" className={styles.back}>← Về trang chủ</Link>
      </div>
      <div className={styles.previewHeading}>
        <p className={styles.eyebrow}>THIẾT KẾ THEO Ý BẠN</p>
        {/* <h1>Một góc xanh.<br />Mang dấu ấn của bạn.</h1> */}
        <p>Chọn dáng bể và những vật liệu cho khu vườn của bạn.</p></div>
      <div className={styles.previewCanvas}>
        <TerrariumIllustration
          selection={selection}
          options={steps.find(step => step.key === "glass")?.options ?? []}
        />
        {materials.length > 0 ? (
          <section className={styles.selectedMaterials} aria-label="Vật liệu đã chọn" tabIndex={0}>
            <h2>Vật liệu đã chọn</h2>
            <ul>
              {materials.map((item) => <li key={`${item.key}-${item.id}`} className={styles.materialLayer}>
                <span className={styles.selectedThumbnail}>
                  <MaterialThumbnail option={item} sizes="(max-width: 760px) 36px, 48px" />
                </span>
                <span className={styles.selectedCopy}>
                  <span>{item.category}</span>
                  <strong>{item.name}</strong>
                </span>
              </li>)}
            </ul>
          </section>
        ) : null}
      </div>
      <div className={styles.previewBottom}>
        <span>{selection.glass ? "Bể kính bạn đã chọn" : "Bắt đầu bằng một chiếc bể kính"}</span>
        <span>{String(complete).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}</span>
      </div>
      {/* <p className={styles.previewNote}>Vật liệu được liệt kê bên cạnh bể. Shop sẽ tư vấn bố cục khi bạn đặt làm.</p> */}
    </aside>

    <div className={styles.materialPanel}>
      <div className={styles.intro}>
        {/* <p className={styles.eyebrow}>CÙNG TẠO MỘT KHU VƯỜN NHỎ</p> */}
        <h2 className={styles.eyebrow}>Cùng tạo một khu vườn nhỏ</h2>
        {/* <h2>Bể của bạn,<br />từng chút một.</h2>
        <p>Chọn những điều bạn thích. Bạn có thể đổi lựa chọn ở bất kỳ bước nào.</p>
        <p className={styles.stockNote}>Các dáng bể trong bộ sưu tập Petite Terre. Shop sẽ xác nhận tình trạng bể, cây và vật liệu khi tư vấn.</p> */}
      </div>
      <fieldset className={styles.step}>
        <legend>
          <span className={styles.stepNumber}>
            KHÔNG BẮT BUỘC
          </span>
          <span className={styles.stepTitle}>Chọn bể mẫu</span>
        </legend>
        <p className={styles.stepDescription}>
          Bắt đầu từ một mẫu có sẵn hoặc tự chọn từ Bước 1. Chọn mẫu sẽ thay toàn bộ vật liệu, giữ ghi chú; bạn có thể chỉnh tiếp bên dưới.
        </p>
        {!catalog.presetsReady ? <p className={styles.stepDescription} role="status">Chưa tải được bể mẫu. Bạn vẫn có thể tự chọn từng vật liệu bên dưới.</p> : !catalog.presets.length ? <p className={styles.stepDescription}>Shop đang chuẩn bị thêm bể mẫu. Bạn có thể tự chọn từ Bước 1.</p> : null}
        <div className={styles.options}>{catalog.presets.map(preset => {
          const recipe = presetSelection(preset, catalog);
          const selected = recipe !== null && sameSelection(selection, recipe);
          return <button key={preset.id} type="button" className={styles.presetCard} disabled={!recipe} aria-pressed={selected} onClick={() => {
            if (!recipe) return;
            dispatch(applyPreset(recipe)); setShowForm(false); setStatus(`Đã áp dụng ${preset.name}. Bạn có thể chỉnh vật liệu bên dưới.`);
          }}>
            <span className={styles.presetImage}>
              <Image
                src={preset.imageUrl}
                unoptimized={/^https?:\/\//.test(preset.imageUrl)}
                alt={preset.name}
                fill
                sizes="(max-width: 760px) calc(100vw - 48px), (max-width: 1200px) 40vw, 25vw"
              />
            </span>
            <span className={styles.presetCopy}>
              <strong>{preset.name}</strong>
              {preset.isDemo ? <span className={styles.presetBadge}>Mẫu demo</span> : null}
              <span>{preset.description}</span>
              <span>
                {recipe ? preset.materials.map(material => material.name).join(" · ") : "Mẫu tạm chưa dùng được với danh mục hiện tại."}
              </span>
              <span>
                {selected ? "✓ Đang dùng cấu hình này" : recipe ? "Dùng mẫu này →" : "Tạm chưa thể chọn"}
              </span>
            </span>
          </button>;
        })}</div>
      </fieldset>
      {!catalog.ready ? <p role="status">Chưa tải được danh mục vật liệu. Lựa chọn đã lưu vẫn được giữ; vui lòng tải lại trang để thử kết nối.</p> : steps.length === 0 ? <p role="status">Shop chưa công bố danh mục vật liệu.</p> : null}
      {steps.map((step, index) => <fieldset key={step.key} className={styles.step} disabled={step.key !== "glass" && !selection.glass}>
        <legend>
          <span className={styles.stepNumber}>BƯỚC {String(index + 1).padStart(2, "0")}</span>
          <span className={styles.stepTitle}>
            {step.title} <RequiredField />
          </span>
        </legend>
        <p className={styles.stepDescription}>{step.description}</p>
        {step.key === "moss" ? (
          <p
            id="moss-selection-limit"
            className={styles.selectionCount}
            role="status"
          >
            Đã chọn {selection.moss.length}{mossMax === null ? "" : `/${mossMax}`} loại rêu.
          </p>
        ) : null}
        <div className={styles.options}>{step.options.map((option) => {
          const selected = isSelected(selection, step.key, option.id);
          const apiOption = catalog.materials.find(item => item.category === step.key && item.legacyId === option.id);
          const unavailable = catalog.ready && (!apiOption || apiOption.availability === "unavailable");
          const atLimit =
            step.selectionMode !== "single" && !selected && step.maxSelections !== null && (step.key === "glass" ?
              Number(!!selection.glass)
              : selection[step.key].length) >= step.maxSelections;
          return <div className={styles.option} key={option.id}>
            <label className={styles.optionLabel}>
              <input
                type={step.selectionMode === "single" ? "radio" : "checkbox"}
                name={step.key}
                value={option.id}
                checked={selected}
                disabled={!selected && (atLimit || unavailable)}
                aria-describedby={step.key === "moss" ? "moss-selection-limit" : undefined}
                onChange={() => choose(step.key, option.id)}
              />
              <span className={styles.thumbnail}><MaterialThumbnail option={option} /></span>
              <span className={styles.optionCopy}>
                <strong>{option.name}</strong>
                {option.detail ? <span>{option.detail}</span> : null}
                {unavailable ? <span>Tạm chưa nhận lựa chọn này</span> : null}
              </span>
              <span className={styles.check} aria-hidden="true">
                {selected ? "✓" : "+"}
              </span>
            </label>
            {(step.key === "moss" || step.key === "plants") && option.src ? <button
              type="button"
              className={styles.previewButton}
              aria-label={`Xem ảnh ${option.name}`}
              aria-haspopup="dialog"
              onClick={() => setPreview(option)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4.5 4.5M10.5 7.5v6M7.5 10.5h6" />
              </svg>
            </button> : null}
          </div>;
        })}</div>
        {step.key === "glass" && selection.glass && needsSize ? <fieldset className={styles.glassSizes} disabled={glass?.availability === "unavailable"}>
          <legend>
            Chọn kích thước {glass?.name.toLocaleLowerCase("vi")} <RequiredField />
          </legend>
          <div className={styles.options}>{glass?.sizes?.map(option => <div key={option.id} className={styles.option}>
            <label className={styles.optionLabel}>
              <input type="radio" name="glassSize" required value={option.legacyId} checked={selection.glassSize === option.legacyId} disabled={option.availability === "unavailable"} onChange={() => {
                dispatch(chooseGlassSize({ glass: selection.glass, id: option.legacyId })); setShowForm(false); setStatus("");
              }} />
              <span className={styles.optionCopy}>
                <strong>{option.sizeLabel}</strong>
              </span>
              <span className={styles.check} aria-hidden="true">{selection.glassSize === option.legacyId ? "✓" : "+"}</span>
            </label>
          </div>)}</div>
          {/* {!glass?.sizes?.length ? <p role="status">Shop chưa công bố kích thước cho bể này.</p> : !size ? <p className={styles.stepDescription}>Vui lòng chọn một kích thước trước khi gửi thiết kế.</p> : null} */}
        </fieldset> : null}
      </fieldset>)}
      <section className={styles.summary} aria-labelledby="selection-title">
        {/* <p className={styles.eyebrow}>
          MỘT CHÚT NÉT RIÊNG
        </p>
        <h2 id="selection-title">Khu vườn bạn đã chọn</h2>
        {chosen.length ? <ul>{chosen.map((item) => <li key={`${item.key}-${item.name}`}>{item.name}</li>)}</ul> : <p>Chọn bể kính để bắt đầu bản thiết kế.</p>} */}
        <label className={styles.noteLabel} htmlFor="design-note">Bạn muốn thêm điều gì?</label>
        <textarea
          id="design-note"
          value={note}
          onChange={(event) => dispatch(changeNote(event.target.value))}
          maxLength={1000}
          placeholder="Ví dụ: Bố cục đổ dọc xuống như tháp rơi tự do…"
          rows={3}
        />
        <div className={styles.priceSummary} aria-live="polite">
          <span>Giá dự kiến</span>
          <strong>
            {estimate === null ? "Shop xác nhận báo giá" : formatVnd(estimate)}
          </strong>
          <p>Shop xác nhận vật liệu, phí giao và giá cuối cùng trước khi bạn đặt cọc.</p>
        </div>
        {!catalog.ready ? (
          <p role="status">
            Chưa kết nối được danh mục của shop. Bạn vẫn có thể lưu thiết kế hoặc sao chép để nhắn shop; tải lại trang để thử kết nối.
          </p>
        ) : null}
        {showForm ? (
          <DesignRequestForm catalog={catalog} onClose={() => setShowForm(false)} />
        ) : (
          <button
            type="button"
            className={styles.primaryAction}
            disabled={!selection.glass || !sizeReady || !catalog.ready}
            onClick={() => setShowForm(true)}>
            Gửi thiết kế để shop xác nhận →
          </button>
        )}
        {/* <p className={styles.savedNote}>Lựa chọn và ghi chú được tự động lưu trên trình duyệt này.</p>
        <button type="button" className={styles.reset} disabled={!selection.glass} onClick={copySelection}>Sao chép lựa chọn</button> */}
        <div className={styles.contacts}>
          {contacts.map((contact) => (
            <a
              key={contact.label}
              href={contact.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              Nhắn qua {contact.label} ↗
            </a>
          ))}
        </div>
        <p className={styles.status} role="status">{status}</p>
        {/* <p className={styles.summaryNote}>Gửi lựa chọn cho shop để được tư vấn và báo giá trước khi đặt làm.</p> */}
        <button
          type="button"
          className={styles.reset}
          onClick={() => {
            dispatch(resetDesign());
            setShowForm(false);
            setStatus("Đã bắt đầu lại bản thiết kế.");
          }}
        >
          Bắt đầu lại
        </button>
      </section>
    </div>
    <MaterialImageDialog option={preview} onClose={() => setPreview(null)} />
  </main>;
}
