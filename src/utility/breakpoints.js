const findBreakpoint = (label, breakpointMap) => breakpointMap.find(bp => bp.label === label);
const getBreakpointValue = (label, breakpointMap) => typeof label === 'object'
    ? label.size
    : findBreakpoint(label, breakpointMap).size;
const getMaxBreakpointValue = (label, breakpointMap) => {
    if (label === null)
        return;
    /**
     * We do this to prevent collions between breakpoints.
     * https://www.w3.org/TR/mediaqueries-4/#range-context
     */
    const breakpointValue = getBreakpointValue(label, breakpointMap).toString();
    const postfix = breakpointValue.match(/[a-zA-Z]+/) || '';
    const value = parseInt(breakpointValue.match(/[0-9]+/)[0], 10);
    return `${value - 0.01}${postfix}`;
};
function getNextBreakpoint(label, breakpointMap) {
    let index = breakpointMap.indexOf(findBreakpoint(label, breakpointMap));
    return index !== breakpointMap.length - 1 ? breakpointMap[index + 1] : null;
}
function createBreakpointHelpers(labels, breakpoints) {
    const breakpointMap = breakpoints.reduce((arr, size, index) => {
        return [
            ...arr,
            {
                label: labels[index],
                size: size
            }
        ];
    }, []);
    const above = breakpointMap.reduce((obj, bp) => {
        return Object.assign({}, obj, { [bp.label]: `@media (min-width: ${bp.size})` });
    }, {});
    const below = breakpointMap.reduce((obj, bp) => {
        return Object.assign({}, obj, { [bp.label]: `@media (max-width: ${getMaxBreakpointValue(bp.label, breakpointMap)})` });
    }, {});
    const between = breakpointMap.reduce((obj, bp, breakpointMapIndex) => {
        /**
         * Create an array of min - max labels for each breakpoint
         * (xs-md, xs-lg etc)
         */
        const breakpointLabels = labels
            .reduce((arr, label, breakpointLabelIndex) => {
            return [
                ...arr,
                bp.label === label
                    ? null
                    : breakpointMapIndex < breakpointLabelIndex
                        ? { name: `${bp.label}-${label}`, from: bp.label, to: label }
                        : null
            ];
        }, [])
            .filter(bp => bp !== null);
        /**
         * Create an array of CSS media queries from the breakpoint labels
         */
        const mediaQueries = breakpointLabels.reduce((obj, bpName) => {
            return Object.assign({}, obj, { [bpName.name]: `@media (min-width: ${bp.size}) and (max-width: ${breakpointMap.find(bp => bp.label === bpName.to).size})` });
        }, {});
        return Object.assign({}, obj, mediaQueries);
    }, {});
    const only = breakpointMap.reduce((obj, bp) => {
        let nextBreakpoint = getNextBreakpoint(bp.label, breakpointMap);
        let nextSize = nextBreakpoint
            ? getMaxBreakpointValue(nextBreakpoint.label, breakpointMap)
            : null;
        return Object.assign({}, obj, { 
            /**
             * Create min-max queries to target the specific size requested.
             * The last size in the array has no upper limit, so acts the same as
             * `from`
             */
            [bp.label]: nextSize
                ? `@media (min-width: ${bp.size}) and (max-width: ${nextSize})`
                : `@media (min-width: ${bp.size})` });
    }, {});
    return {
        breakpointMap,
        above,
        below,
        between,
        only
    };
}
export { findBreakpoint, getBreakpointValue, getMaxBreakpointValue, getNextBreakpoint, createBreakpointHelpers };