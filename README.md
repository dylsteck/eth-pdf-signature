## eth-pdf-signature

Cryptographically Sign a PDF

Project by [Tayyab Hussain](https://www.tayyabh.com/) and [Dylan Steck](https://dylansteck.com)

Boilerplate generated using [gskril/web3-starter](https://github.com/gskril/web3-starter) as a template


### Using the README.md as a working ground

- [x] Opening Message
    - I believe the current top level messaging is good as is. 

- [] Buttons
    - Button placement seems a bit off
    - We could probably do a better job at making this feel more like a flow, and not just two floating buttons.
    - Also, the user should not be able to press `Affix to PDF` before `Sign Message`

- [] "Stamp"
    - Should we implement a more "stamp-like" similar to the ones found here in [Docusign](https://careerilluminate.com/how-adobe-and-docusign-work-together-to-make-bussiness-life-easier-2/)
    - Maybe in a future iteration
    - But, for now we may want to give the user an option on "top-right", "top-left", "bottom-x" because different PDFs may have whitespace differently. To make it easier on you, maybe just do it "bottom / top" only for now?

-[] Verification
    - My rapid short-term solution is that we verify the signature. *Did this person actually sign this sign this string?*
    - See `verifySignature` function
    - We can ship this version without or just implement, I may leave this one to you.

- [] Message for signature
    - I think the current one seems a bit too formal, let's just go with something short and simple: {walletAddress} signed {hashValue} at unix-time {timestamp}
    - Something along these lines. It will reduce the real estate necessary to put on to the PDF as well.

- [x] Loading/Signing Animations

- [x] Analytics
    - posthog.com is a really simple product that is free to use and simple to implement
    - Currently, the default is Plausible, but it is $9 / mo so I instead went to implement Posthog
    - I've already implemented it, I just need your email to add you

- [] Code Clean up
    - index.tsx is getting sloppy, I did some clean up, but feel free to move things around to make it easier for you.

- [] Hosting
    - I'm not sure what you are using for hosting, I typically use Vercel, but I know it's $20 / month.
    - Greg built this cool IPFS/ENS based websites, but they are not updatable [Link](https://ethglobal.com/showcase/immutable-ens-websites-0ejxp)
    - Open to your suggestions
