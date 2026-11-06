import { requestDate, requestStatusLabels, type TrackedRequest } from "@/lib/request-tracking";
import { RequestCode } from "./request-code";
import styles from "../shared/public-forms.module.css";

export function RequestSummary({ request }: { request: TrackedRequest }) {
  return <section aria-label="Chi tiết yêu cầu" className={styles.result}>
    <RequestCode code={request.number} />
    <p className={styles.status} role="status">{requestStatusLabels[request.status]}</p>
    <p className={styles.hint}>Đã gửi: {requestDate(request.createdAt)}</p>
    <h2>Bể kính và vật liệu đã chọn</h2>
    <ul className={styles.materials}>{request.selection.map(item => <li key={item.id}>{item.name}</li>)}</ul>
    {request.events?.length ? <section aria-labelledby="request-history-title">
      <h2 id="request-history-title">Lịch sử cập nhật</h2>
      <ol className={styles.timeline}>{request.events.map((event, index) => <li key={`${event.createdAt}-${index}`}><strong>{requestStatusLabels[event.status]}</strong><time dateTime={event.createdAt}>{requestDate(event.createdAt)}</time></li>)}</ol>
    </section> : null}
  </section>;
}
