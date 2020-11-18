
/**
 * find a closest point on an interval {A,B} from point P
 * @param P
 * @param A
 * @param B
 * @returns {{x: number, y: number}|*}
 */
export function closestPointBetween2D (P, A, B) {
    const _zero2D = {x: 0, y: 0};

    function _vectorToSegment2D(t, P, A, B) {
        return {
            x: (1 - t) * A.x + t * B.x - P.x,
            y: (1 - t) * A.y + t * B.y - P.y
        }
    }

    function _sqDiag2D(P) {
        return P.x ** 2 + P.y ** 2
    }

    const v = {x: B.x - A.x, y: B.y - A.y};
    const u = {x: A.x - P.x, y: A.y - P.y};
    const vu = v.x * u.x + v.y * u.y;
    const vv = v.x ** 2 + v.y ** 2;
    const t = -vu / vv;
    if (t >= 0 && t <= 1) {
        return _vectorToSegment2D(t, _zero2D, A, B);
    }
    const g0 = _sqDiag2D(_vectorToSegment2D(0, P, A, B));
    const g1 = _sqDiag2D(_vectorToSegment2D(1, P, A, B));
    return g0 <= g1 ? A : B

}