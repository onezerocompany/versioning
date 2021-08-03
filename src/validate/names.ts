const names = [
  'Firebase',
  'Docker',
  'GitHub',
  'GitLab',
  'Bitbucket',
  'Apple',
  'Microsoft',
  'Google',
  'Amazon',
  'Twitter',
  'Facebook',
  'iPhone',
  'iPad',
  'Android',
  'Windows',
  'Linux',
  'Mac',
  'Chrome',
  'Firefox',
  'Safari',
  'Opera',
  'IE',
  'Edge',
  'BlackBerry',
  'Ubuntu',
  'Debian',
  'Raspberry Pi',
  'Fedora',
  'Arch Linux',
  'CentOS',
  'Mint',
  'elementary OS',
  'Kali',
  'FreeBSD',
  'OpenBSD',
  'NetBSD',
  'DragonFly',
  'Solaris',
  'SunOS',
  'OS X',
  'iOS',
  'Apple TV',
  'iPod',
  'Apple Watch',
  'Nexus',
  'Galaxy',
  'Kindle',
  'AirPods',
  'Surface',
  'AirPods Max',
  'Beats',
  'Razer',
  'Logitech',
  'Asus',
  'HP',
  'Lenovo',
  'Dell',
  'Acer',
  'CodeQL',
];

// Check if line contains a name and if it matches the expected format
export const validateNames = (content: string): string[] => {
  const errors: string[] = [];

  // Loop through all names
  for (const name of names) {
    const tokens = content.split(' ').map(token => token.trim());
    const index = tokens
      .map(token => token.toLowerCase())
      .indexOf(name.toLowerCase());

    if (index > -1) {
      const actualName = tokens[index];

      if (actualName !== name) {
        errors.push(`Expected '${name}' but found '${actualName}'`);
      }
    }
  }

  return errors;
};

// Return line with names lowercased
export const lowercaseNames = (line: string): string => {
  let outputLine = line;

  // Loop through all names
  for (const name of names) {
    const namePosition = outputLine.toLowerCase().indexOf(name.toLowerCase());

    if (namePosition > -1) {
      const actualName = outputLine.substring(
        namePosition,
        namePosition + name.length
      );

      outputLine = outputLine.replace(actualName, name.toLowerCase());
    }
  }

  return outputLine;
};
