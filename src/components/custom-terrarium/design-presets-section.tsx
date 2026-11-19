"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { ApiDesignPreset, BuilderCatalog } from "@/lib/builder-catalog";
import type { TerrariumSelection } from "./material-catalog";
import { presetSelection, sameSelection } from "./design-presets";
import styles from "./terrarium-builder.module.css";

const PresetCarousel = dynamic(() => import("./preset-carousel"));
type Props = {
  catalog: BuilderCatalog;
  selection: TerrariumSelection;
  onApply: (selection: TerrariumSelection, name: string) => void;
};

export function DesignPresets({ catalog, selection, onApply }: Props) {
  const choices = useMemo(
    () =>
      catalog.presets.map((preset) => ({
        preset,
        recipe: presetSelection(preset, catalog),
      })),
    [catalog],
  );
  const cards = choices.map(({ preset, recipe }) => ({
    id: preset.id,
    content: (
      <PresetCard
        key={preset.id}
        preset={preset}
        recipe={recipe}
        selected={recipe !== null && sameSelection(selection, recipe)}
        onApply={onApply}
      />
    ),
  }));
  return (
    <fieldset className={styles.step}>
      <legend>
        <span className={styles.stepNumber}>KHÔNG BẮT BUỘC</span>
        <span className={styles.stepTitle}>Chọn bể mẫu</span>
      </legend>
      <p className={styles.stepDescription}>
        Các bể Petite Terre đã làm. Chọn mẫu sẽ thay toàn bộ vật liệu, giữ ghi
        chú; bạn có thể chỉnh tiếp bên dưới.
      </p>
      {!catalog.presetsReady ? (
        <p className={styles.stepDescription} role="status">
          Chưa tải được bể mẫu. Bạn vẫn có thể tự chọn từng vật liệu bên dưới.
        </p>
      ) : !catalog.presets.length ? (
        <p className={styles.stepDescription}>
          Shop đang chuẩn bị thêm bể mẫu. Bạn có thể tự chọn từ Bước 1.
        </p>
      ) : null}
      {cards.length > 2 ? (
        <PresetCarousel items={cards} />
      ) : (
        <div className={styles.options}>
          {cards.map((card) => card.content)}
        </div>
      )}
    </fieldset>
  );
}

function PresetCard({
  preset,
  recipe,
  selected,
  onApply,
}: {
  preset: ApiDesignPreset;
  recipe: TerrariumSelection | null;
  selected: boolean;
  onApply: Props["onApply"];
}) {
  return (
    <button
      type="button"
      className={styles.presetCard}
      disabled={!recipe}
      aria-pressed={selected}
      onClick={() => {
        if (recipe) onApply(recipe, preset.name);
      }}
    >
      <span className={styles.presetImage}>
        {preset.imageUrl ? (
          <Image
            src={preset.imageUrl}
            unoptimized={/^https?:\/\//.test(preset.imageUrl)}
            alt={preset.name}
            fill
            sizes="(max-width: 760px) calc(100vw - 48px), (max-width: 1200px) 40vw, 25vw"
          />
        ) : (
          <span>Chưa có ảnh</span>
        )}
      </span>
      <span className={styles.presetCopy}>
        <strong>{preset.name}</strong>
        <span>{preset.description}</span>
        <span>
          {recipe
            ? preset.materials.map((material) => material.name).join(" · ")
            : preset.configured === false
              ? "Shop đang chuẩn bị công thức vật liệu cho mẫu này."
              : "Mẫu tạm chưa dùng được với danh mục hiện tại."}
        </span>
        <span>
          {selected
            ? "✓ Đang dùng cấu hình này"
            : recipe
              ? "Dùng mẫu này →"
              : "Tạm chưa thể chọn"}
        </span>
      </span>
    </button>
  );
}
