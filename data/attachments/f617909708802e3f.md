# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - img [ref=e6]
      - generic [ref=e10]: Free VIN Check
      - generic [ref=e11]: Enter your vehicle's VIN to get a detailed report and insurance quote.
    - generic [ref=e12]:
      - generic [ref=e13]:
        - button "Auto" [ref=e14] [cursor=pointer]:
          - img [ref=e15]
          - text: Auto
        - button "Powersports" [ref=e19] [cursor=pointer]:
          - img [ref=e20]
          - text: Powersports
        - button "Golf Carts" [ref=e25] [cursor=pointer]:
          - img [ref=e26]
          - text: Golf Carts
      - generic [ref=e31]:
        - generic [ref=e32]:
          - generic [ref=e33]: VIN
          - textbox "VIN" [ref=e34]:
            - /placeholder: Enter 17-character VIN
        - button "Check VIN" [disabled]
  - region "Notifications (F8)":
    - list
  - alert [ref=e35]: Get Your Vehicle Warranty Quote | Instant Coverage
  - button "Restart Quote Flow" [ref=e36] [cursor=pointer]:
    - img [ref=e37]
    - generic [ref=e42]: Restart Quote Flow
```