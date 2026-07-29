/**
 * Draft capacity, per backend.
 *
 * The two numbers differ for a real reason: the database cap exists so the
 * un-paginated list endpoint can return everything a user has stored, while the
 * browser cap exists because localStorage has a hard per-origin quota and a
 * draft carries its full body.
 *
 * The *semantics* are deliberately identical, though — both refuse the write
 * once full rather than evicting an older draft. These are user-authored, and
 * dropping one to make room loses work nobody agreed to give up.
 */
export const MAX_REMOTE_DRAFTS = 200;
export const MAX_LOCAL_DRAFTS = 20;

export function draftLimitMessage(limit: number) {
  return `Draft limit reached (${limit}). Delete a saved draft to make room.`;
}
