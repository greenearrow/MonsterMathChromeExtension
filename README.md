# MonsterMathChromeExtension
See https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked to set up extensions after downloading git repo

This extension performs 3 functions
1) The most generally useful, on any source page on DNDBeyond.com, it will provide a sidebar on the left side that has every monster, magic-item, or spell mentioned and direct links marked as numbers for the paragraph it is found in, counting only those with indexed objects. Direct links for these objects to 1xtramonkey.net also appear, though meaningful support only exists for monsters.
2) On monster pages that exist in 1xtramonkey.net, an example encounter is shown based on the average PC level, number of PCs, and difficulty rating you populate on this extensions options page.
3) On entering monster (and possibly other objects, though not focused) & source pages, downloads the page for archiving. This is technically against the TOS of DNDBeyond, so use responsibly.

All of these features can be disabled on the options page