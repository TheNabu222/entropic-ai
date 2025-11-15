// NOW DECLARED HERE (before component)
const pagesInMainNav = [ ... ];

const CommandCenter = () => {
  // Component code that uses pagesInMainNav
  const masterStats = useMemo(() => {
    // Can now safely use pagesInMainNav!
  }, []);
}
