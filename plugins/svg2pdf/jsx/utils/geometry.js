export function getAngle(from, to) {
    return Math.atan2(to[1] - from[1], to[0] - from[0]);
}
export const cToQ = 2 / 3; // ratio to convert quadratic bezier curves to cubic ones
// transforms a cubic bezier control point to a quadratic one: returns from + (2/3) * (to - from)
export function toCubic(from, to) {
    return [cToQ * (to[0] - from[0]) + from[0], cToQ * (to[1] - from[1]) + from[1]];
}
export function normalize(v) {
    const length = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
    return [v[0] / length, v[1] / length];
}
export function getDirectionVector(from, to) {
    const v = [to[0] - from[0], to[1] - from[1]];
    return normalize(v);
}
export function addVectors(v1, v2) {
    return [v1[0] + v2[0], v1[1] + v2[1]];
}
// multiplies a vector with a matrix: vec' = vec * matrix
export function multVecMatrix(vec, matrix) {
    const x = vec[0];
    const y = vec[1];
    return [matrix.a * x + matrix.c * y + matrix.e, matrix.b * x + matrix.d * y + matrix.f];
}
