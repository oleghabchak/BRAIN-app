export type PolicyType = "privacy" | "terms" | "cookie";

export const getPolicyContent = (policyType: PolicyType) => {
  let title = "";
  let subtitle = "";
  let content = "";

  const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

  switch (policyType) {
    case "privacy":
      title = "Brainsugar Privacy Policy";
      subtitle = "Privacy";
      content = loremIpsum;
      break;
    case "terms":
      title = "Brainsugar Terms of Service";
      subtitle = "Terms";
      content = `These are the terms and conditions governing your use of the Brainsugar application. Please read them carefully.
  
  ${loremIpsum}`;
      break;
    case "cookie":
      title = "Brainsugar Cookie Policy";
      subtitle = "Cookies";
      content = `This policy explains how Brainsugar uses cookies and similar technologies.
  
  ${loremIpsum}`;
      break;
    default:
      title = "Brainsugar Policy";
      subtitle = "Policy";
      content = "No content available for this policy type.";
  }

  return { title, subtitle, content };
};
