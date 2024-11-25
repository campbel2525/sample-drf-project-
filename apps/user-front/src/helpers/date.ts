/**
 * 指定されたISO日時までの秒数を計算する関数
 * @param targetDate ISO 8601形式の日付 (例: "2025-01-01T00:00:00.000000Z")
 * @returns 現在からターゲット日時までの秒数（過去なら負の値）
 */
export function calculateSeconds(targetDate: string): number {
  const now = new Date()
  const target = new Date(targetDate)

  // ターゲット日時と現在時刻の差をミリ秒で計算し、秒に変換
  const secondsUntil = Math.floor((target.getTime() - now.getTime()) / 1000)

  return secondsUntil
}
