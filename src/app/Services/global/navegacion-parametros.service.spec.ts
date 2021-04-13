import { TestBed } from "@angular/core/testing"

import { NavegacionParametrosService } from "./navegacion-parametros.service"

describe("NavegacionParametrosService", () => {
    let service: NavegacionParametrosService

    beforeEach(() => {
        TestBed.configureTestingModule({})
        service = TestBed.inject(NavegacionParametrosService)
    })

    it("should be created", () => {
        expect(service).toBeTruthy()
    })
})
